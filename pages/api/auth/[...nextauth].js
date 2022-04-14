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

        credentials.email = credentials.email.toLowerCase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        const companiesCollection = client.db().collection("companies");
        const company = await companiesCollection.findOne({
          email: credentials.email,
        });

        if (!user && !company) {
          client.close();
          throw new Error("Email o password errata!");
        }

        let isValid;
        if (user) {
          isValid = await verifyPassword(credentials.password, user.password);
        } else {
          isValid = await verifyPassword(
            credentials.password,
            company.password
          );
        }

        if (!isValid) {
          client.close();
          throw new Error("Email o password errata!");
        }

        client.close();
        if (user) {
          return { email: user.email, name: user.name };
        } else {
          return {
            email: company.email,
            name: company.name,
            image: true,
          };
        }
      },
    }),
  ],
});
