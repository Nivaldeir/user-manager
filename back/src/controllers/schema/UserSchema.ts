import { z } from "zod";

export const userSaveSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string().optional(),
  })
});

export const userUpdateSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    username: z.string().optional(),
    enabled: z.boolean().optional()
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const userGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const userFindSchema = z.object({
  query: z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    enabled: z.string().optional(),
    permission: z.string().transform(value => value === "true").optional(),
    loginAudit: z.string().transform(value => value === "true").optional(),
  }),
});

export const userUpdatingByUserPermissionSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    permission: z.string()
  }),
});

export const userUpdatingByUserRoleSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    role: z.string()
  }),
});
