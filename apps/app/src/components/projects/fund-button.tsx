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
  DrawerTrigger,
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
import { useFund } from "~/hooks/use-fund";
import { useProjectDetails } from "~/hooks/use-project-details";
import { TokenAmount } from "../token/token-amount";

const FundSchema = z.object({
  amount: z.coerce.number().positive(),
});

export function FundButton() {
  const { projectAddress } = useParams();
  const { data: details, queryKey: detailsQueryKey } = useProjectDetails(
    projectAddress as Address,
  );
  const [isOpen, toggleOpen] = useState(false);

  const { address } = useAccount();
  const { data: token } = useToken(address);
  const form = useForm({
    resolver: zodResolver(FundSchema),
    defaultValues: { amount: 0 },
  });

  const queryClient = useQueryClient();
  const fund = useFund({
    onSuccess: () => {
      toggleOpen(false);
      queryClient.invalidateQueries(detailsQueryKey);
    },
  });
  const { data: allowance = 0n, queryKey } = useAllowance(
    address!,
    projectAddress as Address,
  );
  const approve = useApprove(projectAddress as Address);
  const _amount = form.watch("amount");
  const amount = useMemo(() => {
    try {
      return parseUnits(String(_amount), token?.decimals);
    } catch (error) {
      console.log(error);
      return 0n;
    }
  }, [_amount]);

  return (
    <div className="sticky bottom-0 -mx-2 flex items-center justify-end border-t bg-white p-1">
      <Drawer open={isOpen} onOpenChange={() => toggleOpen(!isOpen)}>
        <DrawerTrigger asChild>
          <Button className="w-full" onClick={() => toggleOpen(!isOpen)}>
            Fund Project
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Fund Project</DrawerTitle>
            <DrawerDescription>Enter amount to fund</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                const amount = parseUnits(
                  String(values.amount),
                  token?.decimals,
                );
                console.log("Fund", amount);
                if (amount > allowance)
                  return approve
                    .writeContractAsync(amount)
                    .then(() => queryClient.invalidateQueries(queryKey));

                return fund.writeContractAsync(amount);
              })}
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="px-4">
                    <FormControl>
                      <Input
                        autoFocus
                        type="tel"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          !isNaN(Number(e.target.value)) &&
                          field.onChange(Number(e.target.value))
                        }
                      />
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
