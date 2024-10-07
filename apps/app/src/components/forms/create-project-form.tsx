"use client";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { DatePicker } from "~/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { useToken } from "~/hooks/use-token";
import { useUpload } from "~/hooks/use-upload";
import { useCreateProject } from "~/hooks/use-create-project";
import { CreateProjectSchema } from "~/schemas/event";
import { useContracts } from "~/hooks/use-contracts";

export function CreateProjectForm() {
  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      metadata: {
        title: "Aerodrip bar",
        description: `**Objective:**\nCreate and crowdfund a self-service coffee bar.`,
      },
      minFundingAmount: 10, // Default minimum funding amount
      target: 1000, // Default target amount
      deadline: new Date(Date.now() + 60 * 1000 * 2), // Default deadline set to 30 days in the future
    },
  });
  const router = useRouter();
  const { data: balance } = useToken();
  const upload = useUpload();
  const { writeContractAsync, isPending } = useCreateProject();

  return (
    <Form {...form}>
      <form
        className="relative space-y-2"
        onSubmit={form.handleSubmit(async (values) => {
          console.log("Create project", values);
          if (!balance?.decimals) throw new Error("Decimals not set for token");

          const minFundingAmount = parseUnits(
            String(values.minFundingAmount),
            balance?.decimals,
          );

          const target = parseUnits(String(values.target), balance?.decimals);

          const { metadata } = await upload.mutateAsync(values.metadata);

          console.log(metadata);

          return writeContractAsync({
            tokenAddress: balance?.address,
            metadata,
            deadline: Number(values.deadline ?? 0),
            target,
            minFundingAmount,
          }).then((projectAddress) => {
            router.push(`/projects/${projectAddress}`);
          });
        })}
      >
        <div className="sticky left-0 top-0 z-10 flex items-center justify-between bg-white py-2">
          <h3 className="text-2xl font-semibold">Create Project</h3>
          <Button isLoading={upload.isPending || isPending}>Create</Button>
        </div>
        <FormField
          control={form.control}
          name="metadata.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Smoothie & Juice Popup Shop"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder={`**Objective:**\nCreate and crowdfund a 2-hour pop-up Smoothie Shop on the 13th floor of the Marina Hotel each afternoon. The shop will offer healthy, delicious smoothies and cold-pressed juices using natural ingredients in reusable cups.\n\n**Funding Goal:**\nRaise **$1,000** through a 'Genesis Goodness Group' using discounted pre-sales of smoothies.\n\n**Purpose:**\nThis initiative will serve the community while demonstrating a small, repeatable crowdfunding model for future projects.`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Markdown is supported</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="minFundingAmount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Min Funding Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      min={1}
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="absolute right-8 top-2 text-sm font-semibold text-gray-400">
                      {balance?.symbol}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      min={1}
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="absolute right-8 top-2 text-sm font-semibold text-gray-400">
                      {balance?.symbol}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <DatePicker field={field} label="Funding Deadline" />
          )}
        />
      </form>
    </Form>
  );
}
