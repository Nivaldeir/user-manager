import { z } from 'zod'

export const permissionSaveSchema = z.object({
    body: z.object({ name: z.string() }),
})

export const permissionUpdateSchema = z.object({
    body: z.object({ name: z.string() }),
    params: z.object({
        id: z.string(),
    }),
})
