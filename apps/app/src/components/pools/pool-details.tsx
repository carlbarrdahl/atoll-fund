"use client";
import { type Address } from "viem";
import { usePool } from "~/hooks/use-pool";
import { useToken } from "~/hooks/use-token";
import { formatMoney } from "~/lib/format";

export function PoolDetails({ poolAddress }: { poolAddress: Address }) {
  const { data: balance } = useToken(poolAddress);
  const { data: pool } = usePool(poolAddress);
  console.log("pool", pool);
  return (
    <div className="p-2">
      <div className="flex gap-1">
        Funding available:
        <span className="font-semibold">
          {balance?.formatted ? formatMoney(Number(balance.formatted)) : "?"}{" "}
          {balance?.symbol}
        </span>
      </div>
    </div>
  );
}
