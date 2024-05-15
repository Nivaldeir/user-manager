import instance from "@/lib/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const response = await instance.post(process.env.URL_BACKEND!, {
            email: credentials.email,
            password: credentials.password,
          });
          if (response.status === 200) {
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