"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20",
  {
    variants: {
      variant: {
        default: "bg-gray-900 dark:bg-neutral-50",
        success: "bg-primary-400 dark:bg-neutral-50",
        secondary: "bg-secondary-400 dark:bg-neutral-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
