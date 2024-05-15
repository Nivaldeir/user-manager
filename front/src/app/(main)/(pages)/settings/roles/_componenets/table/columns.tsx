"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { SortAscIcon } from "lucide-react";
import { ActionsDropdown } from "../action";
import { Permissions } from "../permissions";

type Role = {
  id: string;
  name: string;
  permission: {
    id: string;
    name: string;
  }[];
};
export const columns: ColumnDef<Role>[] = [
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
    accessorKey: "permission",
    header: "Permissões",
    cell: ({ row }) => (
      <Permissions
        permissioes={row.original.permission}
        roleId={row.original.id}
      />
    ),
  },
  {
    accessorKey: "delete",
    header: () => <div>Ações</div>,
    cell: ({ row }) => <ActionsDropdown roleId={row.original.id} />,
  },
];
