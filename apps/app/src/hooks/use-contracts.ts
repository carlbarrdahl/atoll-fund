import { useChainId } from "wagmi";
import { contracts } from "~/config";

export function useContracts() {
  const chainId = useChainId();
  return contracts[chainId];
}
