import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    idx: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    timage: z.string(),
    author: z.string(),
    authorImage: z.string(),
    authorDescription: z.string(),
    tags: z.array(z.string())
  }),
});

export const collections = { blog };
