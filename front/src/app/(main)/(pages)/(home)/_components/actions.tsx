"use client";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/modal-provider";
import { Ellipsis } from "lucide-react";
import DesactiveAccount from "./desactive-account";
import { useMutation, useQueryClient } from "react-query";
import { updateUser } from "@/services/user";
import { toast } from "@/components/ui/use-toast";

type Props = {
  userId: string;
  enabled: boolean;
};
export function ActionsDropdown({ userId, enabled }: Props) {
  const client = useQueryClient();
  const { setOpen, setClose } = useModal();
  const desactive = useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables, context) => {
      client.invalidateQueries(["users"]);
      toast({
        title: "Alteração de status do usuario",
      });
      setClose();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleDesactiveAccount = () => {
    setOpen(
      <CustomModal subheading="Certeza que deseja excluir sua conta?">
        <DesactiveAccount
          onClose={setClose}
          onUpdate={() =>
            desactive.mutate({ enabled: enabled ? false : true, id: userId })
          }
        />
      </CustomModal>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Ellipsis size={18} />
          <span className="sr-only">Opções</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {enabled ? (
            <DropdownMenuItem
              className="text-center cursor-pointer"
              onClick={() => handleDesactiveAccount()}
            >
              Desativar conta
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-center cursor-pointer"
              onClick={() => handleDesactiveAccount()}
            >
              Ativar conta
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
