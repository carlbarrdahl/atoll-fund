import { type Address } from "viem";
import { useReadContract } from "wagmi";

import abi from "~/abi/EventFunding.json";

export function usePool(poolAddress: Address) {
  return useReadContract({
    address: poolAddress,
    abi,
    functionName: "token",
    query: { enabled: Boolean(poolAddress) },
  });
}
