import { Button } from "@/components/ui/button";

type Props = {
  onClose: () => void;
  onUpdate: () => void;
};
const DesactiveAccount = ({ onClose, onUpdate }: Props) => {
  return (
    <div className="w-full flex gap-4 flex-1">
      <Button
        variant={"destructive"}
        className="flex-grow-[1]"
        onClick={onUpdate}
      >
        Sim
      </Button>
      <Button variant={"ghost"} className="flex-grow-[1]" onClick={onClose}>
        Não
      </Button>
    </div>
  );
};

export default DesactiveAccount;
