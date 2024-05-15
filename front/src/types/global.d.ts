import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      username: string;
      id: string;
      enable: boolean;
      accessToken: string;
    };
  }
}
