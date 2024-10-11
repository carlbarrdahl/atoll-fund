import type { Address } from "viem";
import { baseSepolia, hardhat } from "viem/chains";

export const contracts: Record<number, Record<"token" | "factory", Address>> = {
  [hardhat.id]: {
    token: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    factory: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
  },
  [baseSepolia.id]: {
    token: "0xddb42e2083733d0c65934b182786809c454ffe7b",
    factory: "0x8a3bd649172c8b92d582306b8dfa62cf746a8d33",
  },
};
