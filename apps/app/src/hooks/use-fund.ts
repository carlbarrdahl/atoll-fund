import { useParams } from "next/navigation";
import { getAddress } from "viem";
import { useWriteContract } from "wagmi";

import abi from "~/abi/Project.json";
import { useToast } from "./use-toast";
import { useWaitForEvent } from "./use-wait-for-event";

export function useFund({ onSuccess }: { onSuccess: () => void }) {
  const { projectAddress } = useParams();
  const { toast } = useToast();
  const waitForEvent = useWaitForEvent(abi);
  const { writeContractAsync, ...query } = useWriteContract();
  return {
    ...query,
    writeContractAsync: (amount: bigint) => {
      console.log("fund", amount);
      return writeContractAsync(
        {
          address: getAddress(projectAddress as string),
          abi,
          functionName: "fund",
          args: [amount],
        },
        {
          onSuccess: () => {
            toast({ title: "Funding successful!" });
            onSuccess();
          },
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Funding error",
              variant: "destructive",
            }),
        },
      ).then((hash) => waitForEvent(hash, "Funded"));
    },
  };
}

export function useRefund({ onSuccess }: { onSuccess: () => void }) {
  const { projectAddress } = useParams();
  const { toast } = useToast();
  const waitForEvent = useWaitForEvent(abi);
  const { writeContractAsync, ...query } = useWriteContract();
  return {
    ...query,
    writeContractAsync: () => {
      return writeContractAsync(
        {
          address: getAddress(projectAddress as string),
          abi,
          functionName: "refund",
          args: [],
        },
        {
          onSuccess: () => {
            toast({ title: "Refund successful!" });
            onSuccess();
          },
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Refund error",
              variant: "destructive",
            }),
        },
      ).then((hash) => waitForEvent(hash, "Refunded"));
    },
  };
}

export function useWithdraw({ onSuccess }: { onSuccess: () => void }) {
  const { projectAddress } = useParams();
  const { toast } = useToast();
  const waitForEvent = useWaitForEvent(abi);
  const { writeContractAsync, ...query } = useWriteContract();
  return {
    ...query,
    writeContractAsync: () => {
      return writeContractAsync(
        {
          address: getAddress(projectAddress as string),
          abi,
          functionName: "withdraw",
          args: [],
        },
        {
          onSuccess: () => {
            toast({ title: "Withdraw successful!" });
            onSuccess();
          },
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Withdraw error",
              variant: "destructive",
            }),
        },
      ).then((hash) => waitForEvent(hash, "Withdrawn"));
    },
  };
}

function extractErrorReason(errorMessage: string): string {
  const regex = /reason:\s*(.*)$/m;
  const match = regex.exec(errorMessage);

  return match ? (match[1]?.trim() ?? "") : "";
}
