import type { Address } from "viem";
import { baseSepolia, hardhat } from "viem/chains";

export const contracts: Record<number, Record<"token" | "factory", Address>> = {
  [hardhat.id]: {
    token: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    factory: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
  },
  [baseSepolia.id]: {
    token: "0x13577253d0f17d68c23814177a84488a652d18c5",
    factory: "0x53a27a249518cb777e445a553b5ece124fd1a532",
  },
};
