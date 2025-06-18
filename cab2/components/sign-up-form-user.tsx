"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpFormUser({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const {
      name,
      phoneNumber,
      email,
      password,
      repeatPassword,
      address,
      city,
      pincode,
    } = formData;

    if (
      isNaN(Number(phoneNumber)) ||
      phoneNumber.length !== 10 ||
      isNaN(Number(pincode))
    ) {
      setError("Invalid phone number or pincode");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data:authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: {
            role: "user",
          },
        },
      });


      if (authError) throw authError;
      const uid:any = authData?.user?.id


      const { error: dbError } = await supabase.from("user").insert({
        id:uid,
        name,
        phoneNumber,
        email,
        address,
        city,
        pincode,
      });


      if (dbError){
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const {error} = await supabaseAdmin.auth.admin.deleteUser(uid)
        if (error) throw error;
      };

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4">
              {[
                { label: "Name", name: "name" },
                { label: "Phone Number", name: "phoneNumber", type: "tel" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                {
                  label: "Repeat Password",
                  name: "repeatPassword",
                  type: "password",
                },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "Pincode", name: "pincode" },
              ].map(({ label, name, type = "text" }) => (
                <div className="grid gap-2" key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name as keyof typeof formData] as string}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
