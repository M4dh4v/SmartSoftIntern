'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/app/public/logow.png";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface SignUpFormData {
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

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<string>;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
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
    VehicleNo: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneNumber = Number(formData.phoneNumber);
    const pincode = Number(formData.pincode);

    if (isNaN(phoneNumber) || formData.phoneNumber.length !== 10 || isNaN(pincode)) {
      setError("Invalid phone number or pincode");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const message = await onSubmit(formData);
      console.log(message);
      router.push("/user/sign-up-success");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Panel */}
      <div className="w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
        <Image src={logo} alt="Cabsy Logo" className="w-70 h-auto" priority />
        <h1 className="text-3xl font-bold text-[#bf360c]">Pin 2 Pin Cab Booking</h1>
        <ul className="text-[#4e342e] text-base leading-relaxed">
          <li>🚕 Affordable rides across your city</li>
          <li>📍 Instant location tracking by pincode</li>
          <li>🕒 24x7 Reliable service</li>
          <li>💳 Cashless & safe payments</li>
        </ul>
      </div>

      {/* Right Sign-Up Form Panel */}
      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold text-center">User / Rider Signup</h1>

          <Input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
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
          <Input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <Input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required />
          <Input name="pincode" type="text" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 rounded-xl px-4 py-2"
          >
            <option value="">Select Vehicle Type</option>
            <option value="sedan-4">Sedan - 4 Seater</option>
            <option value="suv-7">SUV - 7 Seater</option>
            <option value="premium-4">Premium - 4 Seater</option>
            <option value="premium-7">Premium - 7 Seater</option>
          </select>

          <Input name="DrivingLicenceNo" type="text" placeholder="Driving Licence Number" value={formData.DrivingLicenceNo} onChange={handleChange} />
          <Input name="VehicleNo" type="text" placeholder="Vehicle Number" value={formData.VehicleNo} onChange={handleChange} />

          <Button
            type="submit"
            className="bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <Link
            href="/rider/login"
            className="text-sm text-center text-zinc-400 hover:text-white underline transition duration-150"
          >
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}
