import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { ApiHandler } from "sst/node/api";
import { userRouter } from "../User/user.controller";
import { createContext, createTRPCRouter } from "./trpc";
import { examRouter } from "../Exam/exam.controller";

export const appRouter = createTRPCRouter({
  user: userRouter,
  exam: examRouter,
});

export type AppRouter = typeof appRouter;

// The handlers for API gateway
export const handler = ApiHandler(
  awsLambdaRequestHandler({
    router: appRouter,
    createContext,
  }) as any,
);
