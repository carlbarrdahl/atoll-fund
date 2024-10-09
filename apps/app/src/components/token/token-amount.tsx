import { formatUnits } from "viem";
import { useToken } from "~/hooks/use-token";
import { formatNumber } from "~/lib/format";

export function TokenAmount({
  amount,
  hideSymbol = false,
}: {
  amount: number | bigint;
  hideSymbol?: boolean;
}) {
  const { data: token } = useToken();
  if (!token) return null;
  const formattedAmount = `${formatNumber(formatUnits(amount ?? 0n, token?.decimals ?? 18))} ${hideSymbol ? "" : token?.symbol}`;

  return <>{formattedAmount}</>;
}
