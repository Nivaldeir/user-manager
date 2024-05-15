import NextAuth from "next-auth";
import { authNextOptions } from '../authOptions';

const handler = NextAuth(authNextOptions);

export default handler;