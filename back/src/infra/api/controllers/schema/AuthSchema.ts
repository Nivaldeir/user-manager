import { z } from 'zod'

export const signInSchema = z.object({
    body: z
        .object({
            email: z.string({
                required_error: 'Email de usuário inválido'
            }).email().optional(),
            password: z.string({ required_error: 'Senha é requerida' }),
        })
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
