"use client";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "@/components/ui/use-toast";
import { modifyPermissionUser } from "@/services/user";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/global/custom-modal";
import { getPermissions } from "@/services/permission";
import { modifyPermissionRole } from "@/services/role";

type PermissionsProps = {
  permissioes: { id: string; name: string }[];
  roleId: string;
};

export const Permissions = ({ permissioes, roleId }: PermissionsProps) => {
  const { data: permission } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  }) as { data: { id: string; name: string }[] };
  const { setOpen, setClose } = useModal();
  const handleClick = () => {
    setOpen(
      <TooltipProvider>
        <CustomModal subheading="Modificar permissões do ususario">
          <aside className="flex gap-4 flex-wrap justify-between  overflow-scroll h-[43vh] w-full">
            {permission?.map((p, index) => (
              <Permission
                key={p.name + index.toString()}
                name={p.name}
                roleId={roleId}
                isExist={!!permissioes.find((e) => e.name === p.name)}
              />
            ))}
          </aside>
          <Button onClick={setClose}>Fechar</Button>
        </CustomModal>
      </TooltipProvider>
    );
  };

  return (
    <div>
      <Button onClick={handleClick}>Permissões</Button>
    </div>
  );
};

type PermissionProps = {
  name: string;
  isExist: boolean;
  roleId: string;
};
export const Permission = ({ name, roleId, isExist }: PermissionProps) => {
  const client = useQueryClient();
  const [value, setValue] = useState(isExist);
  const modify = useMutation({
    mutationFn: modifyPermissionRole,
    onSuccess: (data, variables, context) => {
      toast({
        title: "Alterado",
      });
      client.invalidateQueries(["roles"]);
    },
    onError: (e: any) => {
      toast({
        title: "Solicitação falhou",
        description: e.response.data.message,
      });
      setValue(value);
    },
  });
  const onChange = (val: boolean) => {
    try {
      if (val) {
        modify.mutate({
          endPoist: "adding-permission",
          permission: name,
          roleId,
        });
        setValue(true);
      } else {
        modify.mutate({
          endPoist: "deleting-permission",
          permission: name,
          roleId,
        });
        setValue(false);
      }
    } catch (error) {
      setValue(!val);
    }
  };
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className="cursor-pointer flex items-center space-x-2 gap-4 flex-1 justify-between dark:bg-primary/10 p-2 rounded-sm w-[210px]"
          onClick={() => onChange(!value)}
        >
          <p className="lowercase text-sm truncate">
            {name.replaceAll("_", " ")}
          </p>
          <Switch checked={value} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-black/10 backdrop-blur-xl">
        <p>{name.replaceAll("_", " ")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
