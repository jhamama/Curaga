/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { sessions } from "@/services/utils/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = ({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
  ...event,
});

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
const privateMiddleware = t.middleware((opts) => {
  let session = null;
  if (opts.ctx.headers.authorization) {
    session = sessions.use();
  } else {
    const tokenCookieString = opts.ctx.cookies?.find(
      (str) => str.split("=")[0] === "session",
    );
    if (tokenCookieString === undefined) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No session token found",
      });
    }
    const token = tokenCookieString.split("=")[1];
    session = sessions.verify(token);
  }

  if (session.type !== "user") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Non-user access" });
  }

  return opts.next({
    ctx: { ...opts.ctx, ...session },
  });
});

const adminMiddleware = privateMiddleware.unstable_pipe((opts) => {
  if (opts.ctx.properties.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Non-admin access" });
  }

  return opts.next(opts);
});

// Use this for procedures that you want to be publicly accessible.
export const publicProcedure = t.procedure;

// Use this for procedures that you want to be behind authentication.
export const privateProcedure = publicProcedure.use(privateMiddleware);

// Use this for things you only want accessed by admins
export const adminProcedure = publicProcedure.use(adminMiddleware);
