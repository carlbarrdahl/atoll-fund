import { Client, cacheExchange, fetchExchange } from "urql";

export const client = new Client({
  url: "  https://subgraph.satsuma-prod.com/b7300f97968b/team--787350/atoll/version/v0.0.1/api",
  exchanges: [cacheExchange, fetchExchange],
});
