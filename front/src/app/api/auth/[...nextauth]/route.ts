import instance from "@/lib/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const response = await instance.post(
            "http://localhost:8081/auth/sign-in",
            {
              email: "member-silvar@hotmail.com",
              password: "123",
            }
          );
          if (response.status === 200) {
            console.log(response.data.data);
            cookies().set("jwt", `Bearer ${response.data.data.token}`);
            return response.data.data;
          }
          throw new Error("Senha incorreta");
        } catch (error) {}
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
    verifyRequest: "/sign-in",
    newUser: "/app",
  },
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
