import { type Address } from "viem";
import { useReadContract } from "wagmi";

import ProjectABI from "~/abi/Project.json";

interface ProjectDetails {
  tokenAddress: string;
  projectMetadata: string;
  fundingDeadline: number;
  fundingTarget: number;
  minimumFundingAmount: number;
  isWithdrawn: boolean;
  totalFundsRaised: number;
  canRefund: boolean;
  canWithdraw: boolean;
}

export function useProjectDetails(projectAddress?: Address) {
  const { data, ...query } = useReadContract({
    address: projectAddress!,
    abi: ProjectABI,
    functionName: "getProjectDetails",
    args: [],
    query: { enabled: Boolean(projectAddress) },
  });

  return {
    ...query,
    data: getProjectDetails(data),
  };
}

function getProjectDetails(data: unknown): ProjectDetails | null {
  if (!data || !Array.isArray(data)) return null;
  const tokenAddress = data[0] as string;
  const projectMetadata = data[1] as string;
  const fundingDeadline = Number(data[2]);
  const fundingTarget = Number(data[3]);
  const minimumFundingAmount = Number(data[4]);
  const isWithdrawn = Boolean(data[5]);
  const totalFundsRaised = Number(data[6]);

  const canRefund =
    Date.now() >= fundingDeadline && totalFundsRaised < fundingTarget;
  const canWithdraw =
    Date.now() >= fundingDeadline && totalFundsRaised >= fundingTarget;

  return {
    tokenAddress,
    projectMetadata,
    fundingDeadline,
    fundingTarget,
    minimumFundingAmount,
    isWithdrawn,
    totalFundsRaised,
    canRefund,
    canWithdraw,
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
