import { getAddress, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

import ProjectABI from "~/abi/Project.json";

export interface ProjectDetails {
  owner: Address;
  tokenAddress: string;
  projectMetadata: string;
  fundingDeadline: number;
  fundingTarget: number;
  minimumFundingAmount: number;
  maximumFundingAmount: number;
  minDuration: number;
  maxDuration: number;
  isWithdrawn: boolean;
  totalFundsRaised: number;
  canRefund: boolean;
  canWithdraw: boolean;
}

export function useProjectDetails(projectAddress?: Address) {
  const { address } = useAccount();
  const { data, ...query } = useReadContract({
    address: projectAddress!,
    abi: ProjectABI,
    functionName: "getProjectDetails",
    args: [],
    query: { enabled: Boolean(projectAddress) },
  });

  return {
    ...query,
    data: getProjectDetails(data, address!),
  };
}

function getProjectDetails(
  data: unknown,
  account: Address,
): ProjectDetails | null {
  if (!data || !Array.isArray(data)) return null;

  const tokenAddress = data[0] as string;
  const projectMetadata = data[1] as string;
  const fundingDeadline = Number(data[2]) * 1000;
  const fundingTarget = Number(data[3]);
  const minimumFundingAmount = Number(data[4]);
  const maximumFundingAmount = Number(data[5]);
  const minDuration = Number(data[6]);
  const maxDuration = Number(data[7]);
  const isWithdrawn = Boolean(data[8]);
  const totalFundsRaised = Number(data[9]);
  const owner = getAddress(data[10] as string);

  const canRefund =
    Date.now() >= fundingDeadline && totalFundsRaised < fundingTarget;
  //  && owner !== account;

  const canWithdraw =
    Date.now() >= fundingDeadline &&
    totalFundsRaised >= fundingTarget &&
    owner === account;

  return {
    tokenAddress,
    projectMetadata,
    fundingDeadline,
    fundingTarget,
    minimumFundingAmount,
    maximumFundingAmount,
    minDuration,
    maxDuration,
    isWithdrawn,
    totalFundsRaised,
    canRefund,
    canWithdraw,
    owner,
  };
}

export function useContribution(
  projectAddress?: Address,
  contributorAddress?: Address,
) {
  return useReadContract({
    address: projectAddress!,
    abi: ProjectABI,
    functionName: "contributions",
    args: [contributorAddress],
    query: { enabled: Boolean(projectAddress && contributorAddress) },
  });
}
