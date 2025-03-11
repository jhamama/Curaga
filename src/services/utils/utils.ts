import { SessionProperties } from "./auth";

export const getUserData = (ctx: {
  properties: SessionProperties["user"];
  [key: string]: any;
}) => {
  return { userId: ctx.properties.userId, role: ctx.properties.role };
};

export const isUserAdmin = (role: SessionProperties["user"]["role"]) =>
  role === "admin";
