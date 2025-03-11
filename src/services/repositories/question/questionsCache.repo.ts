import {
  extractBucketAndKeyFromS3Url,
  getObject,
  uploadJsonToS3,
} from "@/services/utils/s3Helpers";
import { enforceSameType } from "@/services/utils/typeHelpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TRPCClientError } from "@trpc/client";
import { CustomAttributeType, Entity, EntityItem } from "electrodb";
import { Bucket } from "sst/node/bucket";
import { Table } from "sst/node/table";
import { z } from "zod";
import { QuestionRecord } from "./question.repo";

const cacheTypeValidator = z.enum(["subTopic", "topic", "subject"]);
type CacheType = z.infer<typeof cacheTypeValidator>;

export const questionCacheValidator = z.object({
  id: z.string(),
  cacheType: cacheTypeValidator,
  cacheLink: z.string(),
  numberOfQuestions: z.number(),
});

const QuestionCacheEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "QuestionCache",
      service: "examCache",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      cacheType: {
        type: CustomAttributeType<CacheType>("string"),
        required: true,
      },
      cacheLink: {
        type: "string",
        required: true,
      },
      numberOfQuestions: {
        type: "number",
        required: true,
      },
      createdAt: {
        type: "number",
        required: true,
        default: () => Date.now(),
        readOnly: true,
      },
    },

    indexes: {
      byId: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: ["cacheType"],
        },
      },
    },
  },
  { table: Table["exam-table"].tableName, client: new DynamoDBClient({}) },
);

type QuestionCacheSchema = z.infer<typeof questionCacheValidator>;
type QuestionCacheRecord = EntityItem<typeof QuestionCacheEntity>;
type QuestionCacheInput = Omit<QuestionCacheRecord, "createdAt">;

enforceSameType<QuestionCacheSchema, QuestionCacheInput>(true);

//////////////////////////////////////////
//////////// ACCESS PATTERNS /////////////
//////////////////////////////////////////

export async function getQuestionsCached(id: string, cacheType: CacheType) {
  const cache = await QuestionCacheEntity.get({
    id,
    cacheType,
  }).go();

  if (!cache?.data)
    throw new TRPCClientError(`Cache for cacheId ${id} not found`);

  const { bucketName, objectKey } = extractBucketAndKeyFromS3Url(
    cache.data.cacheLink,
  );

  const questionDataRaw = await getObject(bucketName, objectKey);
  if (!questionDataRaw) throw new TRPCClientError("Could not find cached data");
  const questionData = JSON.parse(questionDataRaw) as QuestionRecord[];
  return questionData;
}

export async function updateQuestionCache(
  id: string,
  questions: QuestionRecord[],
  cacheType: CacheType,
) {
  // Uploads new cache to S3
  const questionsJSON = JSON.stringify(questions);
  const questionsUrl = await uploadJsonToS3({
    bucketName: Bucket["exam-bucket"].bucketName,
    fileName: `${cacheType}-${id}-${Date.now()}`,
    jsonString: questionsJSON,
  });

  // Updates the cache in the DB
  const cachedQuestions = await QuestionCacheEntity.update({
    id,
    cacheType,
  })
    .set({ cacheLink: questionsUrl, numberOfQuestions: questions.length })
    .go();

  return cachedQuestions;
}
