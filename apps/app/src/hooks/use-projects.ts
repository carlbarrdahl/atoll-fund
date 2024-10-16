"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Address, decodeEventLog, parseAbiItem } from "viem";
import { getLogs } from "viem/actions";
import { useClient, useReadContract } from "wagmi";
import { gql } from "graphql-tag";
import abi from "~/abi/ProjectFactory.json";
import { useContracts } from "./use-contracts";
import { client } from "~/lib/graphql";

export interface Project {
  id: Address;
  target: number;
  totalRaised: number;
  deadline: number;
  minFundingAmount: number;
  metadata: string;
}

interface ProjectGraphQL {
  id: Address;
  target: string;
  totalRaised: string;
  deadline: string;
  minFundingAmount: string;
}

const PROJECTS_QUERY = gql`
  query GetProjects(
    $first: Int
    $skip: Int
    $orderBy: Project_orderBy
    $orderDirection: OrderDirection
    $where: Project_filter
  ) {
    projects(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      owner
      metadata
      deadline
      token
      target
      totalRaised
      minFundingAmount
      maxFundingAmount
    }
  }
`;
const PROJECT_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      owner
      token
      metadata
      deadline
      target
      minFundingAmount
      maxFundingAmount
      minDuration
      maxDuration
      withdrawn
      totalRaised
      contributions {
        id
        funder
        amount
        refunded
      }
    }
  }
`;

export function useProjects(ids?: number[]) {
  return useQuery({
    queryKey: ["projects", ids],
    queryFn: () =>
      client
        .query<{
          projects: ProjectGraphQL[];
        }>(PROJECTS_QUERY, {
          where: { id_in: ids },
        })
        .toPromise()
        .then((r) => r.data?.projects.map(mapProject)),
  });
}

export function useProjectById(id: Address) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () =>
      client
        .query<{ project: ProjectGraphQL }>(PROJECT_QUERY, {
          id: id?.toLowerCase(),
        })
        .toPromise()
        .then((r) => mapProject(r.data?.project)),
  });
}

function mapProject(project?: ProjectGraphQL): Project | null {
  if (!project) return null;
  return {
    ...project,
    deadline: Number(project.deadline ?? 0) * 1000,
    target: Number(project.target),
    totalRaised: Number(project.totalRaised),
    minFundingAmount: Number(project.minFundingAmount),
  };
}
// export function useProjects(ids?: number[]) {
//   const client = useClient();

//   const contracts = useContracts();
//   return useQuery({
//     queryKey: ["projects", client?.uid, ids],
//     queryFn: () =>
//       getLogs(client, {
//         address: contracts?.factory,
//         fromBlock: 0n,
//       }).then(
//         (logs) => {
//           console.log(logs);
//           return Promise.all(
//             logs
//               .filter((log) => log.address === contracts?.factory)
//               .map((log) => {
//                 try {
//                   console.log(log);
//                   return decodeEventLog({
//                     abi,
//                     // eventName: "EventCreated",
//                     ...log,
//                   });
//                 } catch (error) {
//                   // console.log("err", error);
//                   return null;
//                 }
//               })
//               .filter((e) => e?.eventName === "ProjectCreated")
//               .map((event) => {
//                 console.log("event", event);
//                 return event?.args;
//               })
//               .filter(Boolean)
//               .map(async (event) => ({
//                 ...event,
//                 metadata: await fetch(event?.metadata).then((r) => r.json()),
//               })),
//           );
//         },
//         // .then(
//         //   (events) =>
//         //     events
//         //       .filter((event) =>
//         //         ids ? ids.includes(Number(event.eventId)) : true,
//         //       )
//         //       .map((e) => ({
//         //         ...e,
//         //         id: Number(e.id),
//         //         // minParticipants: Number(e.minParticipants),
//         //         // maxParticipants: Number(e.maxParticipants),
//         //       })) as Project[],
//         // ),
//       ),
//     enabled: Boolean(client),
//   });
// }
