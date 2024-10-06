import type { Address } from "viem";
import { baseSepolia, hardhat } from "viem/chains";

export const contracts: Record<number, Record<"token" | "factory", Address>> = {
  [hardhat.id]: {
    token: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    factory: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  [baseSepolia.id]: {
    token: "0x0cac6a62781d1c67de22e9550c9c5ffe133ef790",
    factory: "0x5653baa8c8d9727a3e8ba819d3f0e84cd83472b5",
  },
};
