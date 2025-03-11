import { Api, Bucket, Config, StackContext, Table, use } from "sst/constructs";
import { Auth } from "sst/constructs/future";
import { Exam } from "./exam";

export function Persistence({ stack }: StackContext) {
  const { examBucket, examTable } = use(Exam);

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error("GOOGLE_CLIENT_ID is not set");
  }
  const GOOGLE_CLIENT_ID = new Config.Parameter(stack, "GOOGLE_CLIENT_ID", {
    value: googleClientId,
  });

  const onboardingTable = new Table(stack, "onboarding-table", {
    fields: {
      pk: "string",
      sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "src/services/utils/auth.handler",
      bind: [onboardingTable, GOOGLE_CLIENT_ID],
    },
  });

  const storageBucket = new Bucket(stack, "public-bucket", {
    cors: [
      {
        allowedMethods: ["GET", "PUT", "POST", "DELETE"],
        allowedOrigins: ["https://treena-exam.vercel.app"],
        allowedHeaders: ["*"],
        maxAge: "3000 seconds",
      },
    ],
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /api/trpc/{proxy+}": {
        function: {
          handler: "src/services/controllers/base/router.handler",
        },
      },
      "POST /api/trpc/{proxy+}": {
        function: {
          handler: "src/services/controllers/base/router.handler",
        },
      },
    },
    defaults: {
      function: {
        bind: [
          onboardingTable,
          auth,
          GOOGLE_CLIENT_ID,
          storageBucket,
          examBucket,
          examTable,
        ],
      },
    },
  });

  stack.addOutputs({
    NEXT_PUBLIC_API_URL: api.url,
    NEXT_PUBLIC_AUTH_URL: auth.url,
  });
}
