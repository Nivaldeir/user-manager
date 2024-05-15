import RoleForm from "@/components/forms/adding-role";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {};

const HeaderRole = ({}: Props) => {
  return (
    <header className="flex justify-between">
      <div>
        <p>Todas os cargos do sistema</p>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Adicionar</Button>
        </SheetTrigger>
        <SheetContent>
          <div className="mt-4 h-full">
            <RoleForm />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default HeaderRole;
