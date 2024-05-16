"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/types/schemas/sign-in-schema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "../ui/use-toast";

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
  });
  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    const output = await signIn("credentials", {
      ...data,
    });
    console.log(output);
    toast({
      title: JSON.stringify(output),
    });
  };
  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form
          className="flex flex-col bg-black/40 p-5 rounded-lg gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"outline"}>
            Logar
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center -mt-12">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <Link
              href={"/sign-up"}
              className="bg-background px-2 text-muted-foreground "
            >
              Registrar
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
