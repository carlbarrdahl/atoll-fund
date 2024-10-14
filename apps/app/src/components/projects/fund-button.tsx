"use client";

import { type Address, formatUnits, parseUnits } from "viem";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { useAllowance, useApprove, useToken } from "~/hooks/use-token";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useFund, useRefund, useWithdraw } from "~/hooks/use-fund";
import {
  useContribution,
  useProjectDetails,
} from "~/hooks/use-project-details";
import { TokenAmount } from "../token/token-amount";
import { cn } from "~/lib/utils";

const FundSchema = z.object({
  amount: z.coerce.number().positive(),
});

export function FundButton() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(FundSchema),
  });

  const { projectAddress } = useParams();
  const projectAddr = projectAddress as Address;

  const { data: details, queryKey: detailsQueryKey } =
    useProjectDetails(projectAddr);

  const { address } = useAccount();
  const { data: token } = useToken(address);
  const { data: contribution } = useContribution(projectAddr, address);
  const queryClient = useQueryClient();

  const fund = useFund({
    onSuccess: () => {
      setIsOpen(false);
      void queryClient.invalidateQueries(detailsQueryKey);
    },
  });

  const refund = useRefund({
    onSuccess: () => {
      void queryClient.invalidateQueries(detailsQueryKey);
    },
  });
  const withdraw = useWithdraw({
    onSuccess: () => {
      void queryClient.invalidateQueries(detailsQueryKey);
    },
  });

  const { data: allowance = 0n, queryKey } = useAllowance(
    address!,
    projectAddr,
  );
  const approve = useApprove(projectAddr);

  const minFundingAmount = details?.minimumFundingAmount ?? 0n;
  const _amount = form.watch("amount");
  const amount = useMemo(() => {
    try {
      return parseUnits(String(_amount), token?.decimals ?? 18);
    } catch (error) {
      console.error(error);
      return 0n;
    }
  }, [_amount, token]);

  const balance = token?.value ?? 0;

  const handleSubmit = form.handleSubmit((values) => {
    const amount = parseUnits(String(values.amount), token?.decimals ?? 18);
    if (amount > allowance) {
      return approve.writeContractAsync(amount).then(() => {
        void queryClient.invalidateQueries(queryKey);
      });
    }
    return fund.writeContractAsync(amount);
  });

  useEffect(() => {
    if (token && details && typeof _amount === "undefined") {
      form.setValue("amount", formatUnits(minFundingAmount, token.decimals));
    }
  }, [details, token, form, _amount]);

  return (
    <div className="sticky bottom-0 -mx-2 flex items-center justify-end border-t bg-white p-1">
      <Drawer open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        {(() => {
          switch (true) {
            case details?.isWithdrawn:
              return null;
            case details?.canWithdraw && address === details?.owner:
              return (
                <Button
                  className="w-full"
                  isLoading={withdraw.isPending}
                  onClick={() => withdraw.writeContractAsync()}
                >
                  Withdraw <TokenAmount amount={details.totalFundsRaised} />
                </Button>
              );
            case details?.canRefund:
              return (
                <Button
                  className="w-full"
                  isLoading={refund.isPending}
                  disabled={!contribution}
                  onClick={() => refund.writeContractAsync()}
                >
                  Refund <TokenAmount amount={contribution} />
                </Button>
              );
            case Date.now() < details?.fundingDeadline:
              return (
                <Button className="w-full" onClick={() => setIsOpen(!isOpen)}>
                  Fund Project
                </Button>
              );
            default:
              return null;
          }
        })()}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Fund Project</DrawerTitle>
            <DrawerDescription>Enter amount to fund</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="relative px-4">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) field.onChange(value);
                          }}
                        />
                        <div className="absolute right-2 top-2 text-sm font-semibold text-gray-400">
                          {token?.symbol}
                        </div>

                        <div className="flex justify-between pt-0.5 text-xs text-gray-500">
                          <div
                            className={cn({
                              ["text-red-500"]: amount < minFundingAmount,
                            })}
                          >
                            Min funding:{" "}
                            <TokenAmount amount={minFundingAmount} />
                          </div>
                          <div
                            className={cn({
                              ["text-red-500"]: balance < amount,
                            })}
                          >
                            Balance: <TokenAmount amount={balance} />
                          </div>
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <div className="flex gap-1">
                  <DrawerClose asChild>
                    <Button className="flex-1" variant="outline">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button
                    className="flex-1"
                    type="submit"
                    disabled={
                      balance < amount ||
                      amount < minFundingAmount ||
                      approve.isPending ||
                      fund.isPending
                    }
                    isLoading={approve.isPending || fund.isPending}
                  >
                    {amount > allowance ? "Approve" : "Transfer"}{" "}
                    <TokenAmount amount={amount} />
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
