import { z } from "zod";
export const ProfileEditSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});
