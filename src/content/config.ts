import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    readTime: z.string(),
    preview: z.string()
  })
});

const fieldNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    model: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { blog, fieldNotes };
