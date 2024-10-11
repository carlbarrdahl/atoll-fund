import { getAddress } from "viem";
import { useWriteContract } from "wagmi";

import ProjectFactoryABI from "~/abi/ProjectFactory.json";
import { useToast } from "./use-toast";
import { useWaitForEvent } from "./use-wait-for-event";
import { useContracts } from "./use-contracts";

interface CreateProjectArgs {
  tokenAddress: string;
  metadata: string;
  deadline: number;
  target: bigint;
  minFundingAmount: bigint;
  maxFundingAmount: bigint;
  minDuration: number;
  maxDuration: number;
}

export function useCreateProject() {
  const { toast } = useToast();
  const contracts = useContracts();
  const waitForEvent = useWaitForEvent(ProjectFactoryABI);
  const { writeContractAsync, ...query } = useWriteContract();

  return {
    ...query,
    writeContractAsync: ({
      tokenAddress = "",
      metadata = "",
      deadline = 0,
      target = 0n,
      minFundingAmount = 0n,
      minDuration = 60, // Default to 1 hour
      maxDuration = 31536000, // Default to 365 days
    }: Partial<CreateProjectArgs>) => {
      return writeContractAsync(
        {
          address: getAddress(contracts?.factory as string),
          abi: ProjectFactoryABI,
          functionName: "createProject",
          args: [
            getAddress(tokenAddress),
            metadata,
            deadline,
            target,
            minFundingAmount,
            minDuration,
            maxDuration,
          ],
        },
        {
          onSuccess: () => toast({ title: "Project created!" }),
          onError: (error) =>
            toast({
              title:
                extractErrorReason(String(error)) ?? "Create project error",
              variant: "destructive",
            }),
        },
      )
        .then((hash) => waitForEvent(hash, "ProjectCreated"))
        .then(([{ args }]) => args?.projectAddress);
    },
  };
}

function extractErrorReason(errorMessage: string): string {
  const regex = /reason:\s*(.*)$/m;
  const match = regex.exec(errorMessage);

  return match ? (match[1]?.trim() ?? "") : "";
}
