import { defineCollection, z } from 'astro:content';
import { availableTags } from '@/consts';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.enum(availableTags)).default([]),
    // Cover is a URL path to public/ (e.g., "/images/projects/slug/cover.png")
    cover: z.string().optional(),
    lang: z.enum(['fr', 'en']).default('fr'),
    draft: z.boolean().default(false),
    // Lien externe vers le projet (si applicable)
    liveUrl: z.string().url().optional(),
    // Lien vers le repo GitHub (si applicable)
    repoUrl: z.string().url().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
