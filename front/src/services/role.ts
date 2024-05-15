import instance from "@/lib/axios";
import { getCookies } from "@/lib/cookies";
export const getRoles = async () => {
  const token = await getCookies("jwt");
  const response = await instance.get(`/role`, {
    headers: { Authorization: token },
  });
  return response.data.data;
};
export const modifyPermissionRole = async ({
  permission,
  roleId,
  endPoist,
}: {
  permission: string;
  roleId: string;
  endPoist: string;
}) => {
  const response = await instance.put(
    `/role/${roleId}/${endPoist}`,
    {
      permission,
    },
    { headers: { Authorization: await getCookies("jwt") } }
  );
  return response.data;
};

export const creatingRole = async (input: { name: string }) => {
  const response = await instance.post(`/role`, input, {
    headers: { Authorization: await getCookies("jwt") },
  });
  return response.data;
};
export const deletingRole = async ({ id }: { id: string }) => {
  const token = await getCookies("jwt");
  const response = await instance.delete(`role/${id}`, {
    headers: { Authorization: token },
  });
  console.log(response.data);
  return response.data;
};
