import { z } from "zod";

export const SubjectValidator = z.object({
  name: z.string(),
  description: z.string(),
  syllabusLink: z.string(),
  country: z.string(),
  state: z.string(),
});

export type Subject = z.infer<typeof SubjectValidator>;

const SubTopicValidator = z.object({
  subTopicId: z.string(),
  name: z.string(),
  description: z.string(),
  mappedFrom: z.number().array().optional(),
});

export const TopicValidator = z.object({
  topicId: z.string(),
  name: z.string(),
  description: z.string(),
  subTopics: z.array(SubTopicValidator),
});

export type SubTopic = z.infer<typeof SubTopicValidator>;
export type Topic = z.infer<typeof TopicValidator>;
