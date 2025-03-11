import { RouterOutput } from "@/app/utils/trpc/react";

export type TopicSettings = Record<
  string,
  {
    amount: number;
    difficulty: number;
    showSubtopics: boolean;
    subtopics: Record<
      string,
      { difficulty: number; amount: number; name: string }
    >;
    name: string;
  }
>;

export const initializeTopicSelection = ({
  subject,
  initialAmount = 0,
  initialDifficulty = 1,
}: {
  subject: RouterOutput["exam"]["getAllSubjects"][0];
  initialAmount?: number;
  initialDifficulty?: number;
}) => {
  const initialTopicSelection: TopicSettings = {};

  subject.topics.forEach((topic) => {
    const subTopicInitial: Record<string, any> = {};
    topic.subTopics.forEach((subTopic) => {
      subTopicInitial[subTopic.subTopicId] = {
        difficulty: initialDifficulty,
        amount: initialAmount,
        name: subTopic.name,
      };
    });

    initialTopicSelection[topic.topicId] = {
      difficulty: initialDifficulty,
      amount: initialAmount,
      showSubtopics: false,
      subtopics: subTopicInitial,
      name: topic.name,
    };
  });

  return initialTopicSelection;
};
