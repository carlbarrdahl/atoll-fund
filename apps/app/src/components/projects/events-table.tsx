"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  BanknoteIcon,
  Check,
  ChevronDown,
  ClockIcon,
  ListPlus,
  ListX,
  Minus,
  MinusIcon,
  MoreHorizontal,
  PlusIcon,
  User2Icon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Meta } from "../ui/meta";
import Link from "next/link";

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  fundingToken: string;
  targetParticipants: number;
  costPerParticipant: number;
  startDate: Date;
  deadline: Date;
};

const mockEvents: Event[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `event-${i}`,
  title: `Sample Event ${i + 1}`,
  description: "This is a mock event for demonstration purposes.",
  location: "scvyedrrw",
  fundingToken: "ETH",
  targetParticipants: 5,
  costPerParticipant: 5,
  startDate: new Date("2024-11-15T18:00:00"),
  deadline: new Date("2024-06-01T23:59:59"),
}));

export const columns: ColumnDef<Event>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  // checked={row.getIsSelected()}
  // onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div>
          <Link href={`/events/${row.original.id}`}>
            <h3 className="text-lg font-semibold underline">
              {row.getValue("title")}
            </h3>
          </Link>
          <div className="flex gap-2 text-sm">
            <Meta icon={UsersIcon}>
              <div>{row.original.targetParticipants}</div>
            </Meta>
            <Meta icon={BanknoteIcon}>
              <div>${row.original.costPerParticipant}</div>
            </Meta>
          </div>

          <div>{row.original.description}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div>
        {new Intl.DateTimeFormat("en-US").format(row.getValue("startDate"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <Button
          size="icon"
          className="rounded-full"
          icon={row.getIsSelected() ? Check : PlusIcon}
          variant={row.getIsSelected() ? "default" : "outline"}
          onClick={() => row.toggleSelected(!row.getIsSelected())}
        ></Button>
      );
    },
  },
];

export function EventsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: mockEvents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  console.log(table);
  console.log(table.getState());
  console.log(table.getSelectedRowModel());

  const maxCost = table
    .getSelectedRowModel()
    .rows.reduce(
      (sum, x) =>
        x.original.costPerParticipant > sum
          ? x.original.costPerParticipant
          : sum,
      0,
    );
  return (
    <div className="w-full">
      <div className="items-centerpy-4 flex">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sticky bottom-0 flex items-center justify-end bg-white py-1">
        <div className="mr-4 text-lg font-semibold">${maxCost}</div>
        <Button className="">Fund Events</Button>
      </div>
    </div>
  );
}
