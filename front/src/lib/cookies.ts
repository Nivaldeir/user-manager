"use server";

import { cookies } from "next/headers";
export const getCookies = async (name: string) => {
  const result = cookies().get(name)?.value;
  if (result) {
    return result;
  }
  return "";
};
