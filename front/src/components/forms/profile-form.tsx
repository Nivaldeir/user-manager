"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileEditSchema } from "@/types/schemas/profile-edit-schema";
import { Input } from "../ui/input";

type Props = {};

const ProfileForm = ({}: Props) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <FormField
          disabled={true}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          disabled={true}
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
