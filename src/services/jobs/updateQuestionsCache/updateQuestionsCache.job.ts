import {
  getAllQuestions,
  QuestionRecord,
} from "@/services/repositories/question/question.repo";
import { updateQuestionCache } from "@/services/repositories/question/questionsCache.repo";
import { getAllSubjects } from "@/services/repositories/subject/subject.repo";

export const handler = async () => {
  const subjects = await getAllSubjects();
  let questionsFetch = await getAllQuestions();

  const subTopicCaches: { [key: string]: QuestionRecord[] } = {};
  const topicCaches: { [key: string]: QuestionRecord[] } = {};
  const subjectCaches: { [key: string]: QuestionRecord[] } = {};

  // GOES THROUGH ALL THE QUESTIONS AND ADDS THEM TO THE CACHE OBJECTS
  do {
    const questions = questionsFetch.data;
    for (const question of questions) {
      // PROCESS SUB TOPIC
      if (!subTopicCaches[question.subTopicId])
        subTopicCaches[question.subTopicId] = [];
      subTopicCaches[question.subTopicId].push(question);

      // PROCESS TOPIC
      if (!topicCaches[question.topicId]) topicCaches[question.topicId] = [];
      topicCaches[question.topicId].push(question);

      // PROCESS SUBJECT
      subjects
        .filter((subject) => {
          return subject.topics.find((topic) =>
            topic.subTopics.find(
              (subTopic) => subTopic.subTopicId === question.subTopicId,
            ),
          );
        })
        .forEach((subject) => {
          if (!subjectCaches[subject.subjectId])
            subjectCaches[subject.subjectId] = [];
          subjectCaches[subject.subjectId].push(question);
        });
    }

    // GET REMAINING QUESTIONS
    if (questionsFetch.cursor === null) break;
    questionsFetch = await getAllQuestions(questionsFetch.cursor);
  } while (questionsFetch.data.length > 0);

  // UPDATE THE CACHES IN THE DATABASE
  for (const [subTopicId, questions] of Object.entries(subTopicCaches)) {
    await updateQuestionCache(subTopicId, questions, "subTopic");
  }

  for (const [topicId, questions] of Object.entries(topicCaches)) {
    await updateQuestionCache(topicId, questions, "topic");
  }

  for (const [subjectId, questions] of Object.entries(subjectCaches)) {
    await updateQuestionCache(subjectId, questions, "subject");
  }
};
