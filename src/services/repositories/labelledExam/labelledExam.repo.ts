import {
  LabelRecord,
  LabelRecordValidator,
} from "@/app/components/Labeller/labeller.types";
import { enforceSameType } from "@/services/utils/typeHelpers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CustomAttributeType, Entity, EntityItem } from "electrodb";
import { Table } from "sst/node/table";
import { z } from "zod";

const labelledExamStatuses = ["labelling", "reviewing", "done"] as const;

export const labelledExamStatusValidator = z.enum(labelledExamStatuses);

type LabelledExamStatus = z.infer<typeof labelledExamStatusValidator>;

const LabelledExamEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "LabelledExam",
      service: "exam",
    },
    attributes: {
      labelledExamId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      examName: {
        type: "string",
        required: true,
        readOnly: true,
      },
      subjectId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      fileLink: {
        type: "string",
        required: true,
        readOnly: true,
      },
      userId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      reviewerId: {
        type: "string",
        readOnly: false,
        required: false,
      },
      status: {
        type: CustomAttributeType<LabelledExamStatus>("string"),
        required: true,
        readOnly: false,
      },
      labelData: {
        type: CustomAttributeType<LabelRecord>("any"),
        required: false,
        readOnly: false,
      },
      createdAt: {
        type: "number",
        required: true,
        default: () => Date.now(),
        readOnly: true,
      },
      updatedAt: {
        type: "number",
        watch: "*",
        set: () => Date.now(),
        readOnly: false,
      },
    },

    indexes: {
      byUserId: {
        pk: {
          field: "pk",
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          composite: ["labelledExamId"],
        },
      },
      byStatus: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["status"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["labelledExamId"],
        },
      },
      byExamId: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["labelledExamId"],
        },
        sk: {
          field: "gsi2sk",
          composite: [],
        },
      },
    },
  },
  { table: Table["exam-table"].tableName, client: new DynamoDBClient({}) },
);

export const LabelledExamValidator = z.object({
  labelledExamId: z.string(),
  examName: z.string(),
  subjectId: z.string(),
  fileLink: z.string(),
  userId: z.string(),
  reviewerId: z.string().optional(),
  status: labelledExamStatusValidator,
  labelData: LabelRecordValidator.optional(),
});

export type LabelledExam = z.infer<typeof LabelledExamValidator>;
type LabelledExamRecord = EntityItem<typeof LabelledExamEntity>;
type LabelledExamRecordInput = Omit<LabelledExamRecord, "createdAt">;

enforceSameType<LabelledExam, LabelledExamRecordInput>(true);

//////////////////////////////////////////
//////////// ACCESS PATTERNS /////////////
//////////////////////////////////////////

export async function addLabelledExam(
  labelledExamData: LabelledExamRecordInput,
) {
  const labelledExam = await LabelledExamEntity.create(labelledExamData).go();
  return labelledExam;
}

export async function getLabelledExamByUserId(
  userId: string,
  cursor: string | null = null,
) {
  const labelledExams = (
    await LabelledExamEntity.query.byUserId({ userId }).go({ cursor })
  ).data;
  return labelledExams;
}

export async function getLabelledExamById(labelledExamId: string) {
  const labelledExam = (
    await LabelledExamEntity.query.byExamId({ labelledExamId }).go()
  ).data;
  return labelledExam.length > 0 ? labelledExam[0] : null;
}

export async function deleteLabelledExamById(
  userId: string,
  labelledExamId: string,
) {
  await LabelledExamEntity.delete({ userId, labelledExamId }).go();
}

export async function getLabelledExamByStatus(
  status: LabelledExamStatus,
  cursor: string | null = null,
) {
  const labelledExam = await LabelledExamEntity.query
    .byStatus({ status })
    .go({ cursor });

  return labelledExam;
}

export async function updateLabelledExam(
  userId: string,
  labelledExamId: string,
  update: Partial<LabelledExamRecordInput>,
) {
  const labelledExam = await LabelledExamEntity.update({
    userId,
    labelledExamId,
  })
    .set(update)
    .go();
  return labelledExam;
}
