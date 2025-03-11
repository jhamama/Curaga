import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCClientError } from "@trpc/client";
import { randomUUID } from "crypto";
import { Bucket } from "sst/node/bucket";
import { z } from "zod";
import {
  addExam,
  getExamById,
  updateExamById,
} from "../../repositories/exam/exam.repo";
import {
  LabelledExamValidator,
  addLabelledExam,
  deleteLabelledExamById,
  getLabelledExamById,
  getLabelledExamByStatus,
  getLabelledExamByUserId,
  labelledExamStatusValidator,
  updateLabelledExam,
} from "../../repositories/labelledExam/labelledExam.repo";
import {
  addQuestions,
  QuestionRecord,
  questionValidator,
} from "../../repositories/question/question.repo";
import { getQuestionsCached } from "../../repositories/question/questionsCache.repo";
import {
  getAllSubjects,
  getSubject,
} from "../../repositories/subject/subject.repo";
import {
  deleteObjectFromS3,
  extractBucketAndKeyFromS3Url,
} from "../../utils/s3Helpers";
import { getUserData, isUserAdmin } from "../../utils/utils";
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
} from "../base/trpc";
import { QuestionData } from "@/app/components/Labeller/labeller.types";
import { WeightedRandomPicker } from "../../utils/WeightedRandomPicker";
import { m } from "framer-motion";
import { difficultyWeighting } from "./helpers/difficultyMatrix";

export const examRouter = createTRPCRouter({
  getUploadUrls: privateProcedure
    .input(z.object({ count: z.number().min(1) }))
    .query(async (opts) => {
      const { input } = opts;
      const bucketName = Bucket["exam-bucket"].bucketName;

      const urls = await Promise.all(
        Array.from({ length: input.count }).map(async () => {
          const command = new PutObjectCommand({
            ACL: "public-read-write",
            Key: `examItem-${randomUUID()}`,
            Bucket: bucketName,
          });
          const preSignUploadUrl = await getSignedUrl(
            new S3Client({}),
            command,
          );
          return preSignUploadUrl;
        }),
      );
      return urls;
    }),

  getSubjectData: privateProcedure
    .input(z.object({ subjectId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const subjectTopicData = await getSubject(input.subjectId);
      return subjectTopicData;
    }),

  getAllSubjects: privateProcedure.query(async () => {
    const allSubjects = await getAllSubjects();
    return allSubjects;
  }),

  addLabelledExam: privateProcedure
    .input(
      LabelledExamValidator.pick({
        examName: true,
        subjectId: true,
        fileLink: true,
      }),
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { userId } = getUserData(ctx);
      const labelledExam = await addLabelledExam({
        ...input,
        userId,
        labelledExamId: randomUUID(),
        status: "labelling",
      });
      return labelledExam;
    }),

  getLabelledExamsByUserId: privateProcedure.query(async (opts) => {
    const { ctx } = opts;
    const { userId } = getUserData(ctx);
    const labelledExams = await getLabelledExamByUserId(userId);
    return labelledExams;
  }),

  getAllLabelledExams: adminProcedure
    .input(z.object({ status: labelledExamStatusValidator }))
    .query(async (opts) => {
      const { ctx, input } = opts;

      const labelledExams = await getLabelledExamByStatus(input.status);
      return labelledExams;
    }),

  getLabelledExamById: privateProcedure
    .input(z.object({ labelledExamId: z.string() }))
    .query(async (opts) => {
      const { ctx, input } = opts;
      const { userId, role } = getUserData(ctx);
      const isAdmin = isUserAdmin(role);
      const labelledExam = await getLabelledExamById(input.labelledExamId);
      if (!isAdmin && labelledExam?.userId !== userId)
        throw new TRPCClientError("Unauthorized access");
      return labelledExam;
    }),

  deleteLabelledExamById: privateProcedure
    .input(z.object({ labelledExamId: z.string() }))
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { userId, role } = getUserData(ctx);
      const isAdmin = isUserAdmin(role);

      const labelledExam = await getLabelledExamById(input.labelledExamId);
      if (!isAdmin && labelledExam?.userId !== userId)
        throw new Error("Unauthorized access");
      if (!labelledExam) throw new TRPCClientError("Labelled exam not found");
      if (labelledExam.status === "done")
        throw new TRPCClientError("Exam already done");
      const { bucketName, objectKey } = extractBucketAndKeyFromS3Url(
        labelledExam.fileLink,
      );

      deleteObjectFromS3(bucketName, objectKey)
        .then(() => deleteLabelledExamById(userId, input.labelledExamId))
        .catch((error) => console.error("Failed to delete object", error));
    }),

  updateLabelledExam: privateProcedure
    .input(
      z.object({
        labelledExamId: z.string(),
        updateData: LabelledExamValidator.pick({
          labelData: true,
        }).partial(),
      }),
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { userId, role } = getUserData(ctx);
      const isAdmin = isUserAdmin(role);

      const labelledExam = await getLabelledExamById(input.labelledExamId);
      if (!labelledExam) throw new TRPCClientError("Labelled exam not found");
      if (labelledExam.status === "done")
        throw new TRPCClientError("Exam already done");
      if (!isAdmin && labelledExam?.userId !== userId)
        throw new Error("Unauthorized access");

      try {
        const updatedLabelledExam = await updateLabelledExam(
          labelledExam.userId,
          input.labelledExamId,
          input.updateData,
        );
        return updatedLabelledExam;
      } catch (error) {
        console.error("Exam update failed ", error);
      }
    }),

  updateExamStatus: privateProcedure
    .input(
      z.object({
        labelledExamId: z.string(),
        status: labelledExamStatusValidator,
      }),
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { role } = getUserData(ctx);
      const isAdmin = isUserAdmin(role);

      if (input.status === "done" && !isAdmin) {
        throw new TRPCClientError("Unauthorized access");
      }

      const exam = await getLabelledExamById(input.labelledExamId);
      if (!exam) throw new TRPCClientError("Exam not found");
      if (exam.status === "done")
        throw new TRPCClientError("Exam already done");

      const updatedExam = await updateLabelledExam(
        exam.userId,
        exam.labelledExamId,
        {
          status: input.status,
        },
      );
      return updatedExam;
    }),

  completeLabelledExam: adminProcedure
    .input(
      z.object({
        labelledExamId: z.string(),
        questions: z.array(questionValidator.omit({ id: true })),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      // Fetch the exam and check theres the same number of questions as the label data
      const exam = await getLabelledExamById(input.labelledExamId);
      if (!exam) throw new TRPCClientError("Exam not found");
      if (exam.status === "done")
        throw new TRPCClientError("Exam already done");
      if (!exam?.labelData) throw new TRPCClientError("Exam not labelled");

      const labelDataEntries = Object.entries(exam.labelData);
      const labelDataQuestions = labelDataEntries.filter(
        ([_, value]) => value.type === "question",
      );
      const labelDataSolutions = labelDataEntries.filter(
        ([_, value]) => value.type === "solution",
      );

      if (labelDataQuestions.length !== labelDataSolutions.length) {
        throw new TRPCClientError(
          "Number of questions and solutions do not match",
        );
      }

      if (input.questions.length !== labelDataQuestions.length) {
        throw new TRPCClientError(
          "Number of questions does not match labelled questions",
        );
      }

      // Upload the questions to the DB
      const newQuestionIds: string[] = [];
      const questionsToUpload = input.questions.map((question) => {
        const questionId = randomUUID();
        newQuestionIds.push(questionId);
        return { ...question, id: questionId };
      });

      await addQuestions(questionsToUpload);

      // Update the exam status to done and add the reviewer id
      await updateLabelledExam(exam.userId, exam.labelledExamId, {
        status: "done",
        reviewerId: getUserData(opts.ctx).userId,
      });
    }),

  createExam: privateProcedure
    .input(
      z.object({
        subjectId: z.string(),
        numMinutes: z.number().min(30).max(120),
        topicOptions: z.record(
          z.string(),
          z.object({
            amount: z.number(),
            difficulty: z.number().min(1).max(5),
            subtopics: z.record(
              z.string(),
              z.object({
                amount: z.number(),
                difficulty: z.number().min(1).max(5),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { userId } = getUserData(ctx);

      // Fetch the full topic cache if all subtopics are 100%, otherwise create an array for the topic out of only the subtopic caches
      const cachedSubjectQuestions = await getQuestionsCached(
        input.subjectId,
        "subject",
      );

      const questionTopicObject: Record<string, QuestionRecord[]> = {};
      const questionSubTopicObject: Record<string, QuestionRecord[]> = {};

      for (const question of cachedSubjectQuestions) {
        if (question.topicId in questionTopicObject) {
          questionTopicObject[question.topicId].push(question);
        } else {
          questionTopicObject[question.topicId] = [question];
        }

        if (question.subTopicId in questionSubTopicObject) {
          questionSubTopicObject[question.subTopicId].push(question);
        } else {
          questionSubTopicObject[question.subTopicId] = [question];
        }
      }

      // Filter out any topics with 0 amount
      const selectedTopics = Object.entries(input.topicOptions).filter(
        ([_, topic]) => topic.amount > 0,
      );

      const weightedTopics = [];

      for (const [topicId, topicData] of selectedTopics) {
        const subtopicEntries = Object.entries(topicData.subtopics);
        const subTopicEqualWeighting = subtopicEntries.every(
          ([_, subTopic]) => subTopic.amount === subtopicEntries[0][1].amount,
        );

        if (subTopicEqualWeighting) {
          if (!(topicId in questionTopicObject)) continue;
          const topicQuestions = questionTopicObject[topicId];
          if (topicQuestions.length === 0) continue;
          const questionsInTopic = new WeightedRandomPicker(
            topicQuestions.map((q) => {
              return {
                value: q,
                weight:
                  difficultyWeighting[Math.round(topicData.difficulty)][ // topicData out of 5
                    Math.round(q.difficulty) // Question difficulty out of 10
                  ],
              };
            }),
          );

          weightedTopics.push({
            value: questionsInTopic,
            weight: topicData.amount,
          });
        } else {
          const subTopicEntriesFiltered = subtopicEntries.filter(
            ([_, subTopic]) => subTopic.amount > 0,
          );

          const weightedSubTopics = [];

          for (const [subTopicId, subTopicData] of subTopicEntriesFiltered) {
            if (!(subTopicId in questionSubTopicObject)) continue;
            const subTopicQuestions = questionSubTopicObject[subTopicId];
            if (subTopicQuestions.length === 0) continue;
            const questionsInSubTopic = new WeightedRandomPicker(
              subTopicQuestions.map((q) => ({
                value: q,
                weight:
                  difficultyWeighting[Math.round(subTopicData.difficulty)][
                    Math.round(q.difficulty / 2)
                  ],
              })),
            );

            weightedSubTopics.push({
              value: questionsInSubTopic,
              weight: subTopicData.amount,
            });
          }

          if (weightedSubTopics.length === 0) continue;
          const questionsInTopic = new WeightedRandomPicker(weightedSubTopics);
          weightedTopics.push({
            value: questionsInTopic,
            weight: topicData.amount,
          });
        }
      }

      const questionPicker = new WeightedRandomPicker(weightedTopics);

      const MINUTES_PER_MARK = 1.8;
      const marksRequired = input.numMinutes / MINUTES_PER_MARK;
      let marksTotal = 0;

      const questions = [];

      while (!questionPicker.isEmpty() && marksTotal <= marksRequired) {
        const question = questionPicker.pickRandom();
        marksTotal += question.marks;
        questions.push(question);
      }

      if (questions.length === 0) {
        throw new TRPCClientError("Not enough questions to make an exam 🥲");
      }

      const exam = await addExam({
        examName: "Untitled Exam",
        subjectId: input.subjectId,
        public: false,
        creatorId: userId,
        id: randomUUID(),
        questions: questions,
      });

      return exam.data;
    }),
  // updateExam: privateProcedure
  //   .input(
  //     z.object({
  //       examId: z.string(),
  //       updateData: z.object({
  //         examName: z.string().optional(),
  //         questionIds: z.array(z.string()).optional(),
  //         public: z.boolean().optional(),
  //       }),
  //     }),
  //   )
  //   .mutation(async (opts) => {
  //     const { input, ctx } = opts;
  //     const { userId, role } = getUserData(ctx);
  //     const isAdmin = isUserAdmin(role);

  //     const exam = await getExamById(input.examId);
  //     if (!exam) throw new TRPCClientError("Exam not found");
  //     if (exam.creatorId !== userId || isAdmin)
  //       throw new TRPCClientError("Unauthorized access");

  //     const updatedExam = await updateExamById(exam, input.updateData);
  //     return updatedExam;
  //   }),

  getExamById: privateProcedure
    .input(z.object({ examId: z.string() }))
    .query(async (opts) => {
      const { ctx, input } = opts;
      const { userId, role } = getUserData(ctx);
      const isAdmin = isUserAdmin(role);
      const exam = await getExamById(input.examId);

      // Restrict who can access it
      return exam;
    }),
});
