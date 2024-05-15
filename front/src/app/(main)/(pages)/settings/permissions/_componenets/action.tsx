"use client";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "@/components/ui/use-toast";
import { deletingPermissions } from "@/services/permission";

type Props = {
  permissionId: string;
};
export function ActionsDropdown({ permissionId }: Props) {
  const client = useQueryClient();
  const { setOpen, setClose } = useModal();
  const onDelete = useMutation({
    mutationFn: deletingPermissions,
    onSuccess: (data, variables, context) => {
      client.invalidateQueries(["permissions"]);
      toast({
        title: "Permissão excluido com sucesso",
      });
      setClose();
    },
    onError: (error: any) => {
      toast({
        title: error.response.data.message,
      });
      setClose();
    },
  });
  const handleDesactiveAccount = () => {
    setOpen(
      <CustomModal subheading="Certeza que deseja excluir sua conta?">
        <DeletePermission
          onClose={setClose}
          onDelete={() =>
            onDelete.mutate({
              id: permissionId,
            })
          }
        />
      </CustomModal>
    );
  };
  return (
    <Button onClick={handleDesactiveAccount}>
      <span>Excluir</span>
    </Button>
  );
}

type DeletePermissionProps = {
  onClose: () => void;
  onDelete: () => void;
};
const DeletePermission = ({ onClose, onDelete }: DeletePermissionProps) => {
  return (
    <div className="w-full flex gap-4 flex-1">
      <Button
        variant={"destructive"}
        className="flex-grow-[1]"
        onClick={onDelete}
      >
        Sim
      </Button>
      <Button variant={"ghost"} className="flex-grow-[1]" onClick={onClose}>
        Não
      </Button>
    </div>
  );
};
