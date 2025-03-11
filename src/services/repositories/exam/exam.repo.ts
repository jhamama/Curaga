import { enforceSameType } from "@/services/utils/typeHelpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CustomAttributeType, Entity, EntityItem } from "electrodb";
import { Table } from "sst/node/table";
import { z } from "zod";
import { questionValidator } from "../question/question.repo";

const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

export const ExamValidator = z.object({
  id: z.string(),
  examName: z.string(),
  subjectId: z.string(),
  creatorId: z.string(),
  public: z.boolean().optional(),
  questions: z.array(questionValidator),
  expiresAt: z.number().optional(),
});

const ExamEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Exam",
      service: "exam",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      examName: {
        type: "string",
        required: true,
        readOnly: false,
      },
      subjectId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      creatorId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      public: {
        type: "boolean",
        required: false,
        readOnly: false,
      },
      questions: {
        type: CustomAttributeType<z.infer<typeof questionValidator>[]>("any"),
        required: true,
        readOnly: false,
      },
      createdAt: {
        type: "number",
        required: true,
        default: () => Date.now(),
        readOnly: true,
      },
      expiresAt: {
        type: "number",
        default: () => Math.floor((Date.now() + oneWeekInMilliseconds) / 1000),
        required: false,
        readOnly: false,
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
      byCreatorId: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["creatorId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["id"],
        },
      },
      bySubjectId: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["subjectId"],
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

export type Exam = z.infer<typeof ExamValidator>;
type ExamRecord = EntityItem<typeof ExamEntity>;
type ExamRecordInput = Omit<ExamRecord, "createdAt">;

enforceSameType<Exam, ExamRecordInput>(true);

//////////////////////////////////////////
//////////// ACCESS PATTERNS /////////////
//////////////////////////////////////////

export async function addExam(examData: ExamRecordInput) {
  const exam = await ExamEntity.create(examData).go();
  return exam;
}

export async function getExamsByCreatorId(
  creatorId: string,
  cursor: string | null = null,
) {
  const exams = (
    await ExamEntity.query.byCreatorId({ creatorId }).go({ cursor })
  ).data;
  return exams;
}

export async function getExamById(examId: string) {
  const exam = (await ExamEntity.query.byId({ id: examId }).go()).data;
  return exam.length > 0 ? exam[0] : null;
}

export async function deleteExamById(examId: string) {
  const exam = await getExamById(examId);
  if (!exam) throw new Error("Exam not found");
  await ExamEntity.delete(exam).go();
}

export async function getExamBySubjectId(subjectId: string) {
  const exams = await ExamEntity.query.bySubjectId({ subjectId }).go();
  return exams;
}

export async function updateExamById(
  exam: ExamRecord,
  examData: { examName?: string; questionIds?: string[]; public?: boolean },
) {
  await ExamEntity.update(exam).set(examData).go();
}

export async function saveExam(id: string) {
  await ExamEntity.update({ id }).remove(["expiresAt"]).go();
}
