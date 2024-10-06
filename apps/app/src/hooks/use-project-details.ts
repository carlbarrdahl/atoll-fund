import { useParams } from "next/navigation";
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
}

export function useProjectDetails(projectAddress?: Address) {
  const { data, ...query } = useReadContract({
    address: projectAddress!,
    abi: ProjectABI,
    functionName: "getProjectDetails",
    args: [],
    query: { enabled: Boolean(projectAddress) },
  });

  const projectDetails: ProjectDetails | null =
    data && Array.isArray(data)
      ? {
          tokenAddress: data[0] as string,
          projectMetadata: data[1] as string,
          fundingDeadline: Number(data[2]),
          fundingTarget: Number(data[3]),
          minimumFundingAmount: Number(data[4]),
          isWithdrawn: Boolean(data[5]),
          totalFundsRaised: Number(data[6]),
        }
      : null;

  return {
    ...query,
    data: projectDetails,
  };
}
