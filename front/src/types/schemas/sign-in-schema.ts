import { z } from "zod";
export const signInSchema = z.object({
  email: z.string().email(),
  username: z.string({ required_error: "Nome de usuário inválido" }).optional(),
  password: z.string({ required_error: "Senha é requerida" }),
});
