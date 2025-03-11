import * as z from "zod";

export const LabelBoxLocationValidator = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type LabelBoxLocation = z.infer<typeof LabelBoxLocationValidator>;

export const LabelPartInfoValidator = z.object({
  location: LabelBoxLocationValidator,
  pageNumber: z.number().optional(),
});

export type LabelPartInfo = z.infer<typeof LabelPartInfoValidator>;

export const LabelPartValidator = z.object({
  parentId: z.string(),
  id: z.string(),
  ...LabelPartInfoValidator.shape,
});

export type LabelPart = z.infer<typeof LabelPartValidator>;

export const SolutionDataValidator = z.object({
  questionName: z.string(),
});

export type SolutionData = z.infer<typeof SolutionDataValidator>;

export const QuestionDataValidator = z.object({
  questionName: z.string(),
  marks: z.number(),
  difficulty: z.number(),
  topic: z.union([
    z.object({ value: z.string(), label: z.string() }),
    z.object({
      label: z.string(),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
  ]),
});

export type QuestionData = z.infer<typeof QuestionDataValidator>;

export const isQuestionData = (
  data: QuestionData | SolutionData,
): data is QuestionData => {
  return (data as QuestionData).marks !== undefined;
};

export const BaseLabelValidator = z.object({
  parts: z.array(LabelPartValidator),
  id: z.string(),
});

export interface BaseLabel extends z.infer<typeof BaseLabelValidator> {}

export const TempLabelValidator = BaseLabelValidator.extend({
  type: z.literal("temp"),
});

export interface TempLabel extends z.infer<typeof TempLabelValidator> {}

export const QuestionLabelValidator = BaseLabelValidator.extend({
  type: z.literal("question"),
  data: QuestionDataValidator,
});

export interface QuestionLabel extends z.infer<typeof QuestionLabelValidator> {}

export const SolutionLabelValidator = BaseLabelValidator.extend({
  type: z.literal("solution"),
  data: SolutionDataValidator,
});

export interface SolutionLabel extends z.infer<typeof SolutionLabelValidator> {}

export const LabelValidator = z.union([
  QuestionLabelValidator,
  SolutionLabelValidator,
  TempLabelValidator,
]);

export type Label = z.infer<typeof LabelValidator>;

export type LabelWithData = z.infer<
  typeof QuestionLabelValidator | typeof SolutionLabelValidator
>;

// Defines the Allowable Data types for the label data fields

export const TopicOptionsValidator = z.union([
  z.object({ value: z.string(), label: z.string() }),
  z.object({
    label: z.string(),
    options: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
]);

export type TopicOptions = z.infer<typeof TopicOptionsValidator>;

export const LabelRecordValidator = z.record(LabelValidator);
export type LabelRecord = z.infer<typeof LabelRecordValidator>;

export const LabellerStateValidator = z.object({
  labels: LabelRecordValidator,
  topics: z.array(TopicOptionsValidator),
});

export type LabellerState = z.infer<typeof LabellerStateValidator>;
