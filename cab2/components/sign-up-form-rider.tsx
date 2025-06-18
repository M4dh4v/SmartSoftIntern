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

export interface RiderSignUpData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
  city: string;
  pincode: string;
  vehicleType: string;
  DrivingLicenceNo: string;
  VehicleNo: string;
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
    city: "",
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
      city,
      pincode,
      vehicleType,
      DrivingLicenceNo,
      VehicleNo,
    } = formData;

    // basic validation
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

      // 1) sign up in Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/protected`,
            data: { role: "rider" },
          },
        });
      if (authError) throw authError;

      const uid = authData.user?.id;
      if (!uid) throw new Error("No user ID returned after sign-up");

      // 2) insert into rider table
      const { error: dbError } = await supabase.from("rider").insert({
        id: uid,
        name,
        phoneNumber,
        email,
        address,
        city,
        pincode,
        vehicleType,
        DrivingLicenceNo,
        VehicleNo,
      });

      if (dbError) {
        const supabaseAdmin = await createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        const {error: delError} = await supabase.auth.admin.deleteUser(uid)

        if (delError) throw delError
      }

      router.push("/auth/sign-up-success");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Rider Sign up</CardTitle>
          <CardDescription>Create a new rider account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value.replace(/\D/g, ""),
                }))
              }
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              name="repeatPassword"
              type="password"
              placeholder="Repeat Password"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />

            <Label htmlFor="vehicleType">Vehicle Type</Label>
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
              Already have an account?{" "}
              <Link
                href="/rider/login"
                className="underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
