import { useQuery } from "@tanstack/react-query";
import { type Metadata } from "~/schemas/metadata";

export function useMetadata(url?: string) {
  return useQuery({
    queryKey: ["metadata", url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Metadata>;
    },
    enabled: !!url,
  });
}
