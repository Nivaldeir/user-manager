import CustomModal from "@/components/global/custom-modal";
import Spin from "@/components/global/spin";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { getRoles } from "@/services/role";
import { modifyRoleUser } from "@/services/user";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

type Props = {
  role: string;
  userId: string;
};
const Role = ({ role, userId }: Props) => {
  const { setOpen } = useModal();
  const [roleSelected, setRoleSelected] = useState<string>(role);
  const handleClick = () => {
    setOpen(
      <RoleItem onClick={() => setRoleSelected} role={role} userId={userId} />
    );
  };

  return (
    <Button className="capitalize flex w-24 text-center" onClick={handleClick}>
      {role}
    </Button>
  );
};

export default Role;

const RoleItem = ({
  onClick,
  role,
  userId,
}: {
  onClick: () => void;
  role: string;
  userId: string;
}) => {
  const [roleSelected, setRoleSelected] = useState<string>(role);
  const [loading, setLoading] = useState(false);
  const client = useQueryClient();
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    retry: 1,
  }) as { data: { id: string, name: string }[] };
  useEffect(() => { }, [roleSelected]);

  const updatingUser = useMutation({
    mutationFn: modifyRoleUser,
    onSuccess: (data, variables, context) => {
      client.invalidateQueries(["users"]);
      toast({
        title: "Alterador",
      });
    },

    onError: (err) => {
      setLoading(false);
    },
  });

  return (
    <CustomModal subheading="Qual cargo deseja mudar?">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {data?.map((e, index) => (
            <div
              key={e + index.toString()}
              className={`w-full p-2 rounded-lg cursor-pointer hover:bg-white/20 ${e.name === roleSelected ? "bg-white/30" : "0"
                }`}
              onClick={() => setRoleSelected(e.name)}
            >
              <p className="capitalize text-center w-full">{e.name}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          onClick={() => updatingUser.mutate({ role: roleSelected, userId })}
          disabled={loading}
        >
          {!loading ? (
            "Atualizar"
          ) : (
            <div className="flex items-center gap-4">
              <Spin color="black" />
              Atualizando...
            </div>
          )}
        </Button>
      </div>
    </CustomModal>
  );
};
