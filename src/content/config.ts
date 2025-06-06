import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    idx: z.number(),
    title: z.string(),
    date: z.coerce.date(),
    timage: z.string(),
    author: z.string(),
    authorImage: z.string(),
    authorDescription: z.string(),
    tags: z.array(z.number())
  }),
});

export const collections = { blog };
