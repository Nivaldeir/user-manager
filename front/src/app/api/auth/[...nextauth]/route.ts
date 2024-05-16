import instance from "@/lib/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          console.log(credentials);
          const response = await instance.post("auth/signin", {
            email: "member-silvar@hotmail.com",
            password: "123",
          });
          if (response.status === 200) {
            cookies().set("jwt", `Bearer ${response.data.data.token}`);
            return response.data.data;
          }
          throw new Error("Senha incorreta");
        } catch (error) {
          console.error("ERROR", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        //@ts-ignore
        token = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};
const handler = NextAuth(authNextOptions);
export { handler as GET, handler as POST };
