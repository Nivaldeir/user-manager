"use client";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, SortAscIcon } from "lucide-react";
import { Permissions } from "../permissions";

import { ActionsDropdown } from "../actions";
import RoleDropwn from "../role";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <SortAscIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.enabled ? "Ativado" : "Inativo"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Posição",
    cell: ({ row }) => (
      <RoleDropwn role={row.original.role} userId={row.original.id} />
    ),
  },
  {
    accessorKey: "permission",
    header: "Permissões",
    cell: ({ row }) => (
      <Permissions
        permissioes={row.original.permission}
        userId={row.original.id}
      />
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <ActionsDropdown
        userId={row.original.id}
        enabled={row.original.enabled}
      />
    ),
  },
];
