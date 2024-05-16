import instance from "@/lib/axios";
import { getCookies } from "@/lib/cookies";
type IModifyRoleUser = {
  userId: string;
  role: string;
};
type IModifyPermissionUser = {
  userId: string;
  permission: string;
  endPoist: "deleting-permission" | "adding-permission";
};
type UpdateUser = {
  username?: string;
  email?: string;
  password?: string;
  enabled?: boolean;
  id: string;
};
export const getUsers = async () => {
  console.log("AQUI", process.env.NEXT_PUBLIC_BACKEND_API);
  const response = await instance.get("/user", {
    headers: { Authorization: await getCookies("jwt") },
  });
  console.log("Data", response);
  return response.data;
};
export const updateUser = async (user: UpdateUser) => {
  const response = await instance.put(`/user/${user.id}`, user, {
    headers: { Authorization: await getCookies("jwt") },
  });
  return response.data;
};
export const modifyRoleUser = async ({ role, userId }: IModifyRoleUser) => {
  const response = await instance.put(
    `/user/${userId}/update-role`,
    {
      role,
    },
    { headers: { Authorization: await getCookies("jwt") } }
  );
  return response.data;
};
export const modifyPermissionUser = async ({
  permission,
  userId,
  endPoist,
}: IModifyPermissionUser) => {
  const response = await instance.put(
    `/user/${userId}/${endPoist}`,
    {
      permission,
    },
    { headers: { Authorization: await getCookies("jwt") } }
  );
  return response.data;
};
