import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../base/trpc";
import {
  changeUserName,
  getUserDetails,
} from "@/services/repositories/user/user.repo";

export const userRouter = createTRPCRouter({
  userDetails: privateProcedure.query(async (opts) => {
    const { ctx } = opts;
    const { userId } = ctx.properties;
    const user = await getUserDetails(userId);
    return user;
  }),
  changeUserName: privateProcedure.input(z.string()).mutation(async (opts) => {
    const { ctx, input: userName } = opts;
    const { userId } = ctx.properties;
    const updatedUser = await changeUserName(userId, userName);
    return updatedUser;
  }),
});
