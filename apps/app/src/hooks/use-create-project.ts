import { useParams } from "next/navigation";
import { getAddress } from "viem";
import { useWriteContract } from "wagmi";

import ProjectFactoryABI from "~/abi/ProjectFactory.json";
import { useToast } from "./use-toast";
import { useWaitForEvent } from "./use-wait-for-event";
import { useContracts } from "./use-contracts";

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
    }) => {
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
        .then(([{ args }]) => args.projectAddress);
    },
  };
}

function extractErrorReason(errorMessage: string): string {
  const regex = /reason:\s*(.*)$/m;
  const match = regex.exec(errorMessage);

  return match ? (match[1]?.trim() ?? "") : "";
}
