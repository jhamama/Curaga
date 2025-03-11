import { enforceSameType } from "@/services/utils/typeHelpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, EntityItem } from "electrodb";
import { Table } from "sst/node/table";
import { z } from "zod";

export const questionValidator = z.object({
  id: z.string(),
  difficulty: z.number(),
  marks: z.number(),
  questionName: z.string(),
  topicId: z.string(),
  subTopicId: z.string(),
  questionUrl: z.string(),
  solutionUrl: z.string(),
  labelledExamId: z.string(),
  labelledExamName: z.string(),
  createdAt: z.number().optional(),
});

const QuestionEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Question",
      service: "exam",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      difficulty: {
        type: "number",
        required: true,
      },
      marks: {
        type: "number",
        required: true,
      },
      questionName: {
        type: "string",
        required: true,
      },
      topicId: {
        type: "string",
        required: true,
      },
      subTopicId: {
        type: "string",
        required: true,
      },
      questionUrl: {
        type: "string",
        required: true,
      },
      solutionUrl: {
        type: "string",
        required: true,
      },
      labelledExamId: {
        type: "string",
        required: true,
      },
      labelledExamName: {
        type: "string",
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
          composite: [],
        },
      },
      byTopic: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["topicId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["id"],
        },
      },
      bySubtopic: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["subTopicId"],
        },
        sk: {
          field: "gsi2sk",
          composite: ["id"],
        },
      },
    },
  },
  { table: Table["exam-table"].tableName, client: new DynamoDBClient({}) },
);

type QuestionSchema = z.infer<typeof questionValidator>;
export type QuestionRecord = EntityItem<typeof QuestionEntity>;
type QuestionRecordInput = Omit<QuestionRecord, "createdAt">;

enforceSameType<QuestionSchema, QuestionRecordInput>(true);

//////////////////////////////////////////
//////////// ACCESS PATTERNS /////////////
//////////////////////////////////////////

export async function addQuestions(questionsData: QuestionRecordInput[]) {
  const question = await QuestionEntity.put(questionsData).go();
  return question;
}

export async function getQuestionsById(questionIds: string[]) {
  const question = await QuestionEntity.get(
    questionIds.map((questionId) => ({ id: questionId })),
  ).go();
  return question;
}

export async function getAllQuestions(cursor?: string) {
  return await QuestionEntity.scan.go({ cursor });
}
