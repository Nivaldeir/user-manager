import PermissionForm from "@/components/forms/adding-permission";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {};

const HeaderPermissions = ({}: Props) => {
  return (
    <header className="flex justify-between">
      <div>
        <p>Todas as permissões do sistema</p>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Adicionar</Button>
        </SheetTrigger>
        <SheetContent>
          <div className="mt-4 h-full">
            <PermissionForm />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default HeaderPermissions;
