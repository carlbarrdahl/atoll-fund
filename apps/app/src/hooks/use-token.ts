import { erc20Abi, formatUnits, type Address } from "viem";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { useWaitForEvent } from "./use-wait-for-event";
import { useContracts } from "./use-contracts";

export function useToken(account?: Address) {
  const contracts = useContracts();
  const contract = {
    address: contracts?.token,
    abi: [
      ...erc20Abi,
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
  } as const;

  const { data, ...query } = useReadContracts({
    contracts: [
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      ...(account
        ? [{ ...contract, functionName: "balanceOf", args: [account] }]
        : []),
    ],
  });

  const [symbol, decimals = 0, balance = 0] = data?.map((d) => d.result) ?? [];

  return {
    ...query,
    data: query.isPending
      ? null
      : {
          address: contracts.token,
          value: balance,
          formatted: formatUnits(BigInt(balance as number), Number(decimals)),
          symbol,
          decimals: Number(decimals),
        },
  };
}

export function useAllowance(owner: Address, spender: Address) {
  const contracts = useContracts();
  return useReadContract({
    abi: erc20Abi,
    address: contracts?.token,
    args: [owner, spender],
    functionName: "allowance",
    query: { enabled: Boolean(owner && spender) },
  });
}
export function useApprove(spender: Address) {
  const approve = useWriteContract();
  const waitForEvent = useWaitForEvent(erc20Abi);
  const contracts = useContracts();
  return {
    ...approve,
    writeContractAsync: (amount = 0n) =>
      approve
        .writeContractAsync({
          address: contracts?.token,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender, amount],
        })
        .then((hash) => waitForEvent(hash, "Approval")),
  };
}
