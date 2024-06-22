import { z } from 'zod'

export const signInSchema = z.object({
    body: z
        .object({
            email: z.string().email().optional(),
            username: z
                .string({ required_error: 'Nome de usuário inválido' })
                .optional(),
            password: z.string({ required_error: 'Senha é requerida' }),
        })
        .refine((data) => {
            if (!(data.email || data.username)) {
                throw new Error(
                    'Deve ser fornecido um email ou um nome de usuário'
                )
            }
            if (data.email && data.username) {
                throw new Error(
                    "Apenas um dos campos 'email' ou 'username' deve ser fornecido"
                )
            }
            return true
        }),
})

export const recoverySchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
})
export const recoveryNewPasswordSchema = z.object({
    body: z.object({
        password: z.string().min(8, {
            message: 'A senha deve ter no mínimo 8 caracteres',
        }),
    }),
    params: z.object({
        token: z.string(),
    }),
})
