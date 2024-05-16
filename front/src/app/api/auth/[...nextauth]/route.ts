import instance from "@/lib/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const response = await instance.post(
            `${process.env.URL_BACKEND!}/auth/sign-in`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          console.log("RESPONSE", response.data);
          if (response.status === 200) {
            //   cookies().set("jwt", `Bearer ${response.data.data.token}`);
            //   return response.data.data;
          }
          return {} as any;
          // throw new Error("Senha incorreta");
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  // pages: {
  //   signIn: "/sign-in",
  //   error: "/sign-in",
  //   verifyRequest: "/sign-in",
  //   newUser: "/app",
  // },
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
