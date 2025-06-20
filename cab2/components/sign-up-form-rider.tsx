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

export interface RiderSignUpData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
  pincode: string;
  vehicleType: string;
  DrivingLicenceNo: string;
  VehicleNo: string;
}

const vh: Record<string, number>={
  "Sedan - 4 Seater" : 1,
  "SUV - 7 Seater":2,
  "Premium - 4 Seater":3,
  "Premium - 7 Seater":4
}

export function SignUpFormRider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState<RiderSignUpData>({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
    address: "",
    pincode: "",
    vehicleType: "",
    DrivingLicenceNo: "",
    VehicleNo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const {
      name,
      phoneNumber,
      email,
      password,
      repeatPassword,
      address,
      pincode,
      vehicleType,
      DrivingLicenceNo,
      VehicleNo,
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
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/rider/dashboard`,
            data: { role: "rider" },
          },
        });
      if (authError) throw authError;

      const uid = authData.user?.id;
      if (!uid) throw new Error("No user ID returned after sign-up");

      const vehid : number=vh[vehicleType]
      const { error: dbError } = await supabase.from("rider").insert({
        id: uid,
        name,
        phoneNumber,
        vehicleType: vehid,
        vehicleNumber:VehicleNo ,
        address,
        pincode,
        DLno: DrivingLicenceNo,
      });
      console.log(dbError)

      const {data: sdata, error:serror} = await supabase.from('rider').select().eq('id',uid)

      if (dbError || !sdata || serror) {
        const supabaseAdmin = await createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error: delError } = await supabase.auth.admin.deleteUser(uid);

        if (delError) throw delError;
      }

      router.push("/auth/sign-up-success");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col lg:flex-row w-full min-h-screen rounded-2xl overflow-hidden", className)} {...props}>
      <div className="w-full lg:w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
        <Image
          src={logo}
          width={1500}
          height={1500}
          className="mb-4 drop-shadow-xl"
          alt="Cabsy Logo"
        />
        <h1 className="text-3xl font-bold text-[#bf360c]">Drive with Cabsy</h1>
        <ul className="text-[#4e342e] text-base leading-relaxed">
          <li>🛣️ Flexible earning on your schedule</li>
          <li>📍 Instant booking & location by pincode</li>
          <li>🚗 Work with your own vehicle</li>
          <li>💰 Instant payments & daily earning</li>
        </ul>
      </div>

      <div className="w-full lg:w-1/2 bg-[#fff4e6] flex justify-center items-center p-6 text-center">
        <Card className="w-full max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Rider Sign Up</CardTitle>
            <CardDescription>Create your rider account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              <Input
                name="phoneNumber"
                type="tel"
                maxLength={10}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: e.target.value.replace(/\D/g, "") }))
                }
                required
              />
              <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <Input name="repeatPassword" type="password" placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} required />
              <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
              <Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

              <Label htmlFor="vehicleType"></Label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Vehicle Type</option>
                <option value="Sedan - 4 Seater">Sedan - 4 Seater</option>
                <option value="SUV - 7 Seater">SUV - 7 Seater</option>
                <option value="Premium - 4 Seater">Premium - 4 Seater</option>
                <option value="Premium - 7 Seater">Premium - 7 Seater</option>
              </select>

              <Input
                name="DrivingLicenceNo"
                placeholder="Driving Licence Number"
                value={formData.DrivingLicenceNo}
                onChange={handleChange}
                required
              />
              <Input
                name="VehicleNo"
                placeholder="Vehicle Number"
                value={formData.VehicleNo}
                onChange={handleChange}
                required
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm">
                Already have an account? <Link href="/rider/login" className="underline underline-offset-4">Login</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
