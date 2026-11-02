import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
  }),
  schema: z.object({
    idx: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    timage: z.string(),
    author: z.string(),
    authorImage: z.string(),
    authorDescription: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
