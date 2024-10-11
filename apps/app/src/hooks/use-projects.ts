"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { decodeEventLog, parseAbiItem } from "viem";
import { getLogs } from "viem/actions";
import { useClient, useReadContract } from "wagmi";

import abi from "~/abi/ProjectFactory.json";
import { useContracts } from "./use-contracts";

interface Project {
  id: number;
  minParticipants: number;
  maxParticipants: number;
  costPerParticipant: bigint;
  target: bigint;
  minFundingAmount: bigint;
  maxFundingAmount: bigint;
  minDuration: number;
  maxDuration: number;
  metadata: {
    title: string;
    description?: string;
    location?: string;
  };
}

// export function useProjects() {
//   const contracts = useContracts();
//   const factoryAddress = contracts?.factory as Address;
//   return useReadContract({
//     address: factoryAddress,
//     abi,
//     functionName: "getAllProjects",
//     args: [],
//     query: { enabled: Boolean(factoryAddress) },
//   });
// }

export function useProjects(ids?: number[]) {
  const client = useClient();

  const contracts = useContracts();
  return useQuery({
    queryKey: ["projects", client?.uid, ids],
    queryFn: () =>
      getLogs(client, {
        address: contracts?.factory,
        fromBlock: 0n,
      }).then(
        (logs) => {
          console.log(logs);
          return Promise.all(
            logs
              .filter((log) => log.address === contracts?.factory)
              .map((log) => {
                try {
                  console.log(log);
                  return decodeEventLog({
                    abi,
                    // eventName: "EventCreated",
                    ...log,
                  });
                } catch (error) {
                  // console.log("err", error);
                  return null;
                }
              })
              .filter((e) => e?.eventName === "ProjectCreated")
              .map((event) => {
                console.log("event", event);
                return event?.args;
              })
              .filter(Boolean)
              .map(async (event) => ({
                ...event,
                metadata: await fetch(event?.metadata).then((r) => r.json()),
              })),
          );
        },
        // .then(
        //   (events) =>
        //     events
        //       .filter((event) =>
        //         ids ? ids.includes(Number(event.eventId)) : true,
        //       )
        //       .map((e) => ({
        //         ...e,
        //         id: Number(e.id),
        //         // minParticipants: Number(e.minParticipants),
        //         // maxParticipants: Number(e.maxParticipants),
        //       })) as Project[],
        // ),
      ),
    enabled: Boolean(client),
  });
}

export function useEventById(id: number) {
  const { data, ...query } = useEvents([id]);
  return { ...query, data: data?.[0] };
}
