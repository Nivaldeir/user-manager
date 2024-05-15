"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { SortAscIcon } from "lucide-react";
import { ActionsDropdown } from "../action";

type Permission = {
  id: string;
  name: string;
};
export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.name.replaceAll("_", " ")}</div>
    ),
  },
  {
    accessorKey: "delete",
    header: () => <div>Ações</div>,
    cell: ({ row }) => <ActionsDropdown permissionId={row.original.id} />,
  },
];
