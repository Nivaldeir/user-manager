import { Metadata } from "next";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignInForm />
    </div>
  );
}
