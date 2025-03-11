import { Bucket, Function, StackContext, Table } from "sst/constructs";

export function Exam({ stack }: StackContext) {
  const examBucket = new Bucket(stack, "exam-bucket", {});

  const examTable = new Table(stack, "exam-table", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
      gsi2pk: "string",
      gsi2sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: {
      gsi1: { partitionKey: "gsi1pk", sortKey: "gsi1sk" },
      gsi2: { partitionKey: "gsi2pk", sortKey: "gsi2sk" },
    },
    timeToLiveAttribute: "expiresAt",
  });

  // Script to initialise shit
  // const tableScript = new Script(stack, "tableScript", {
  //   onCreate: {
  //     handler: "src/services/repositories/userRepositoryJob.handler",
  //     bind: [table],
  //     permissions: [table],
  //   },
  // });

  const testInjectSubjectFunction = new Function(stack, "injectSubject", {
    handler: "src/services/jobs/subjectInit/addSubject.job.handler",
    logFormat: "",
    bind: [examTable],
  });

  const updateQuestionCacheFunction = new Function(
    stack,
    "updateQuestionCaches",
    {
      handler:
        "src/services/jobs/updateQuestionsCache/updateQuestionsCache.job.handler",
      logFormat: "",
      bind: [examTable, examBucket],
    },
  );

  return {
    examBucket,
    examTable,
  };
}
