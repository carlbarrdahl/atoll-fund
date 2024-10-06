import { put } from "@vercel/blob";
import { MetadataSchema } from "~/schemas/metadata";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const metadataRouter = createTRPCRouter({
  upload: publicProcedure.input(MetadataSchema).mutation(async ({ input }) => {
    const blob = await put("metadata.json", JSON.stringify(input), {
      access: "public",
      contentType: "application/json",
    });
    return { metadata: blob.url };
  }),
});
