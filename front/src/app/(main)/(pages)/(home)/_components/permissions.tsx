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

type PermissionsProps = {
  permissioes: string[];
  userId: string;
};

export const Permissions = ({ permissioes, userId }: PermissionsProps) => {
  const [permissions, setPermissions] = useState([]);
  const { setOpen, setClose } = useModal();
  const { isLoading, error, data } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    retry: 1,
  });
  useEffect(() => {
    if (!isLoading && !error && data) {
      setPermissions(data.map((e: any) => e.name));
    }
  }, [isLoading, error, data]);
  const handleClick = () => {
    setPermissions(data.map((e: any) => e.name));
    setOpen(
      <TooltipProvider>
        <CustomModal subheading="Modificar permissões do ususario">
          <aside className="flex gap-4 flex-wrap justify-between  overflow-scroll h-[43vh] w-full">
            {permissions?.map((p, index) => (
              <Permission
                name={p}
                key={`${p}_${index}`}
                enable={permissioes.includes(p)}
                userId={userId}
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
  enable?: boolean;
  userId: string;
};
export const Permission = ({ name, enable, userId }: PermissionProps) => {
  const client = useQueryClient();
  const [value, setValue] = useState(enable);

  const modify = useMutation({
    mutationFn: modifyPermissionUser,
    onSuccess: (data, variables, context) => {
      toast({
        title: "Alterado",
      });
      client.invalidateQueries(["users"]);
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
          userId: userId,
        });
        setValue(true);
      } else {
        modify.mutate({
          endPoist: "deleting-permission",
          permission: name,
          userId: userId,
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
