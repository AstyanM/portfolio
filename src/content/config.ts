import { defineCollection, z } from 'astro:content';
import { availableTags } from '@/consts';

// Schema for bibliography/source entries
const sourceSchema = z.object({
  authors: z.string(), // e.g., "Martin, L., Muller, B., et al."
  year: z.union([z.string(), z.number()]), // e.g., 2024 or "2024, September 10"
  title: z.string(), // e.g., "CamemBERT: A Tasty French Language Model"
  publisher: z.string().optional(), // e.g., "Hugging Face"
  url: z.string().url().optional(),
});

// Schema for downloadable documents
const documentSchema = z.object({
  title: z.string(), // e.g., "Article scientifique"
  description: z.string().optional(), // Brief description
  url: z.string(), // Path to the file
  type: z.enum(['pdf', 'zip', 'doc', 'other']).default('pdf'),
});

// Schema for project structure
const structureSchema = z.object({
  description: z.string().optional(), // e.g., "Environ 40k lignes de code"
  tree: z.string(), // The folder tree structure
});

// Schema for appendix
const appendixSchema = z.object({
  structure: structureSchema.optional(),
  sources: z.array(sourceSchema).optional(),
  documents: z.array(documentSchema).optional(),
});

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
    // Indique si le repo est privé (ne peut pas être partagé)
    repoPrivate: z.boolean().default(false),
    // Taille de l'équipe (1 = solo, 2 = binôme, etc.)
    teamSize: z.number().int().positive().optional(),
    // Année du projet
    year: z.number().int().min(2000).max(2100).optional(),
    // Conclusion du projet (affichée séparément avec style harmonisé)
    conclusion: z.string().optional(),
    // Annexes du projet (structure, sources, documents)
    appendix: appendixSchema.optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
