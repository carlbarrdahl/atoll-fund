"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { decodeEventLog, parseAbiItem } from "viem";
import { getLogs } from "viem/actions";
import { useClient, useReadContract } from "wagmi";

import abi from "~/abi/ProjectFactory.json";
import { useContracts } from "./use-contracts";

type Event = {
  id: number;
  minParticipants: number;
  maxParticipants: number;
  costPerParticipant: bigint;
  metadata: {
    title: string;
    description?: string;
    location?: string;
  };
};

export function useProjects() {
  const contracts = useContracts();
  const factoryAddress = contracts?.factory as Address;
  return useReadContract({
    address: factoryAddress,
    abi,
    functionName: "getAllProjects",
    args: [],
    query: { enabled: Boolean(factoryAddress) },
  });
}
