"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { toast } from "../ui/use-toast";
import { creatingRole } from "@/services/role";

const RoleForm = ({}) => {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  const handleSubmit = async (data: { name: string }) => {
    try {
      const output = await creatingRole({ name: data.name });
      if (output.message == "Sucesso") {
        toast({ title: "Cargo cadastrada com sucesso" });
        return;
      }
    } catch (error: any) {
      console.log(error);
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
            <SheetTitle className="text-center">Criar Cargo</SheetTitle>
          </SheetHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cargo</FormLabel>
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

export default RoleForm;
