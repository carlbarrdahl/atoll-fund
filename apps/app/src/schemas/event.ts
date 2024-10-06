import { z } from "zod";
import { MetadataSchema } from "./metadata";

export const CreateProjectSchema = z.object({
  metadata: MetadataSchema,
  deadline: z.date(),
  target: z.number().positive(),
  minFundingAmount: z.number().positive(),
});
