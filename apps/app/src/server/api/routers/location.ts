import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// This is a mock function. In a real application, you'd use a geocoding service API.
async function mockGeocode(query: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock results
  const mockResults = [
    { address: "123 Main St, City, Country", lat: 40.7128, lon: -74.006 },
    { address: "456 Elm St, Town, Country", lat: 34.0522, lon: -118.2437 },
    { address: "789 Oak Ave, Village, Country", lat: 51.5074, lon: -0.1278 },
  ];

  // Filter results based on query (case-insensitive)
  return mockResults.filter((result) =>
    result.address.toLowerCase().includes(query.toLowerCase()),
  );
}

export const locationRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const results = await mockGeocode(input.query);
      return results.map((result) => ({
        label: result.address,
        value: result.address,
        coordinates: [result.lat, result.lon] as [number, number],
      }));
    }),
});
