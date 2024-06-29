import { z } from 'zod'

export const roleSaveSchema = z.object({
    body: z.object({
        name: z.string(),
        permissions: z.string().array().optional(),
    }),
})

export const roleUpdateSchema = z.object({
    body: roleSaveSchema,
    params: z.object({
        id: z.string(),
    }),
})

export const roleUpdatingPermissionSchema = z.object({
    params: z.object({
        roleId: z.string(),
    }),
    body: z.object({
        permission: z.string(),
    }),
})
