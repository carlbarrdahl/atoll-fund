"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Button } from "../ui/button";

import { erc20Abi, getAddress, parseUnits } from "viem";
import { useToken } from "~/hooks/use-token";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { useQueryClient } from "@tanstack/react-query";
import { useContracts } from "~/hooks/use-contracts";

export function MintTokens() {
  const { address } = useAccount();
  const waitForEvent = useWaitForEvent(erc20Abi);
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { data: balance, queryKey } = useToken(address);
  const queryClient = useQueryClient();
  const contracts = useContracts();

  console.log(contracts);
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        Balance:
        <div className="font-semibold">
          {balance?.formatted} {balance?.symbol}
        </div>
      </div>
      <Button
        isLoading={isPending}
        onClick={async () => {
          await writeContractAsync({
            address: contracts?.token,
            abi: [
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "to",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "mint",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ],
            functionName: "mint",
            args: [getAddress(address!), parseUnits("1000", balance?.decimals)],
          })
            .then((hash) => waitForEvent(hash, "Transfer"))
            .then(() => queryClient.invalidateQueries(queryKey));
        }}
      >
        Mint Tokens
      </Button>
    </div>
  );
}
