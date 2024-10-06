import { z } from "zod";

export const MetadataSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  location: z.string().optional(),
  // location: z
  //   .string()
  //   .refine(
  //     (value) => {
  //       const [lat, lng] = value.split(",").map(Number) as [number, number];
  //       return (
  //         !isNaN(lat) &&
  //         !isNaN(lng) &&
  //         lat >= -90 &&
  //         lat <= 90 &&
  //         lng >= -180 &&
  //         lng <= 180
  //       );
  //     },
  //     {
  //       message: "Invalid location format. Please use 'latitude,longitude'.",
  //     },
  //   )
  //   .transform((value) => {
  //     const [lat, lng] = value.split(",").map(Number) as [number, number];
  //     console.log(encodeBase32(lat, lng));
  //     return encodeBase32(lat, lng);
  //   }),
});

export type Metadata = z.infer<typeof MetadataSchema>;
