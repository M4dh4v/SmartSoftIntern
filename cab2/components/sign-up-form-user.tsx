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
import Image from "next/image";
import logo from "@/public/logow.png";

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

    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await createClient();
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
      setError("Phone number must be 10 digits and pincode must be numeric");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/user/dashboard`,
          data: {
            role: "user",
          },
        },
      });

      console.log("authData, ", authData)
      if (authError) throw authError;
      const uid: any = authData?.user?.id;

      const { error: dbError } = await supabase.from("user").insert({
        id: uid,
        name,
        phoneNumber,
        address,
        city,
        pincode,
      });

      const ddd = await supabase.from('user').select().eq('id',uid)
      console.log('hit searching for id',ddd)

      if (dbError || !ddd) {
        const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
        if (error) throw error;
      }
      console.log('HIt delete part')
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fff4e6]">
      <div className="w-full max-w-6xl flex shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Side Branding */}
        <div className="w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
          <Image
                    src={logo}
                    alt="logo"
                    width={1500}
                    height={1500} 
                    className="mb-4 drop-shadow-xl"
                  />

          <h1 className="text-3xl font-bold text-[#bf360c]">Pin 2 Pin Cab Booking</h1>
          <ul className="text-[#4e342e] text-base leading-relaxed">
            <li>🚕 Affordable rides across your city</li>
            <li>📍 Instant location tracking by pincode</li>
            <li>🕒 24x7 Reliable service</li>
            <li>💳 Cashless & safe payments</li>
          </ul>
        </div>

        {/* Signup Widget Right Side */}
        <div className="w-1/2 bg-zinc-900 text-white p-10 flex items-center justify-center">
          <Card className="bg-zinc-900 text-white border-none w-full rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Sign up</CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Create your user account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-5">
                {[{ label: "Name", name: "name" },
                  { label: "Phone Number", name: "phoneNumber", type: "tel", prefix: "+91" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Repeat Password", name: "repeatPassword", type: "password" },
                  { label: "Address", name: "address" },
                  { label: "City", name: "city" },
                  { label: "Pincode", name: "pincode" },
                ].map(({ label, name, type = "text", prefix }) => (
                  <div className="grid gap-2" key={name}>
                    <Label htmlFor={name}>{label}</Label>
                    <div className="relative">
                      {prefix && (
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-zinc-400">
                          {prefix}
                        </span>
                      )}
                      <Input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name as keyof typeof formData] as string}
                        onChange={handleChange}
                        required
                        className={prefix ? "pl-12" : ""}
                      />
                    </div>
                  </div>
                ))}

                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <p className="mt-4 text-center text-sm text-zinc-400">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="underline hover:text-white">
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}