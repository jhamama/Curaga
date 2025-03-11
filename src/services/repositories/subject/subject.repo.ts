import { enforceSameType } from "@/services/utils/typeHelpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CustomAttributeType, Entity, EntityItem } from "electrodb";
import { Table } from "sst/node/table";
import { z } from "zod";
import { Subject, SubjectValidator, Topic, TopicValidator } from "./helpers";

const SubjectEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "SubjectWithTopic",
      service: "exam",
    },
    attributes: {
      subjectId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      subjectData: {
        type: CustomAttributeType<Subject>("any"),
        required: true,
      },
      topics: {
        type: CustomAttributeType<Topic[]>("any"),
        required: true,
      },
    },

    indexes: {
      byTopicId: {
        pk: {
          field: "pk",
          composite: ["subjectId"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  { table: Table["exam-table"].tableName, client: new DynamoDBClient({}) },
);

const SubjectWithTopicValidator = z.object({
  subjectId: z.string(),
  subjectData: SubjectValidator,
  topics: z.array(TopicValidator),
});

export type SubjectWithTopic = z.infer<typeof SubjectWithTopicValidator>;
type SubjectWithTopicRecord = EntityItem<typeof SubjectEntity>;
enforceSameType<SubjectWithTopic, SubjectWithTopicRecord>(true);

//////////////////////////////////////////
//////////// ACCESS PATTERNS /////////////
//////////////////////////////////////////

export async function addSubject(subjectData: SubjectWithTopic) {
  return (await SubjectEntity.put(subjectData).go()).data;
}

export async function getSubject(subjectId: string) {
  return (await SubjectEntity.get({ subjectId }).go()).data;
}

export async function getAllSubjects() {
  return (await SubjectEntity.scan.go()).data;
}
