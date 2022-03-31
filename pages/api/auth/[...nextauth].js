import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { hashPassowrd, verifyPassword } from "../middlewares/auth.js";
const databaseConnection = require("../middlewares/database.js");

const client = await databaseConnection();

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        await client.connect();

        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("Email o password errata!");
        }


        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Email o password errata!");
        }

        client.close();
        return { email: user.email, name: user.name };
      },
    }),
  ],
});
