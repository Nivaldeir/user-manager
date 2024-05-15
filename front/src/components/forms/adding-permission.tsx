"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { creatingPermissions } from "@/services/permission";
import { toast } from "../ui/use-toast";

const PermissionForm = ({}) => {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  const handleSubmit = async (data: { name: string }) => {
    try {
      const output = await creatingPermissions(data.name);
      if (output.message == "Sucesso") {
        toast({ title: "Permissão cadastrada com sucesso" });
        return;
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response.data.error });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 justify-between h-full "
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div>
          <SheetHeader>
            <SheetTitle className="text-center">Criar Permissão</SheetTitle>
          </SheetHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Permissão</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="">
          Criar
        </Button>
      </form>
    </Form>
  );
};

export default PermissionForm;
