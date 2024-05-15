import instance from "@/lib/axios";
import { getCookies } from "@/lib/cookies";
export const getPermissions = async () => {
  const token = await getCookies("jwt");
  const response = await instance.get(`/permission`, {
    headers: { Authorization: token },
  });
  return response.data.data;
};

export const creatingPermissions = async (name: string) => {
  const token = await getCookies("jwt");
  const response = await instance.post(
    `permission`,
    { name },
    {
      headers: { Authorization: token },
    }
  );
  return response.data;
};

export const deletingPermissions = async ({ id }: { id: string }) => {
  const token = await getCookies("jwt");
  const response = await instance.delete(`permission/${id}`, {
    headers: { Authorization: token },
  });
  console.log(response.data);
  return response.data;
};
