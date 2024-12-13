import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const schemaSchema = z.object({
  name: z.string().min(1),
  structure: z.object({
    description: z.string().optional(),
    sections: z.array(z.object({
      name: z.string(),
      elements: z.array(z.object({
        type: z.string(),
        label: z.string(),
      })),
    })),
  }),
});

export const contentSchema = z.object({
  schema_id: z.number(),
  data: z.record(z.string(), z.any()),
});