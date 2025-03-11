import {
  AuthHandler,
  GoogleAdapter,
  createSessionBuilder,
} from "sst/node/future/auth";
import {
  addUser,
  getUserDetails,
  UserRecord,
} from "../repositories/user/user.repo";
import { Config } from "sst/node/config";

export type UserProperties = {
  userId: string;
  role: UserRecord["role"];
};

export type SessionProperties = {
  user: UserProperties;
};

// define session types
export const sessions = createSessionBuilder<SessionProperties>();

export const handler = AuthHandler({
  sessions,
  clients: async () => ({
    local: "http://localhost", // This allows local clients to redirect back to localhost
  }),
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: Config.GOOGLE_CLIENT_ID,
    }),
  },
  callbacks: {
    auth: {
      async allowClient() {
        return true;
      },
      async success(input, response) {
        if (input.provider === "google") {
          const claims = input.tokenset.claims();
          let user = await getUserDetails(claims.sub);
          if (!user) {
            user = await addUser({
              userId: claims.sub,
              email: claims.email,
              picture: claims.picture,
              name: claims.given_name,
              role: "user",
            });
          }
          return response.session({
            type: "user",
            properties: {
              userId: user.userId,
              role: user.role,
            },
          });
        }

        throw new Error("Unknown provider");
      },
    },
  },
});
