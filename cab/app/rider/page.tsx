
            
'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkUser } from "./actions";
import Image from "next/image";
import logo from "@/app/public/logo.png"; // Make sure to rename the image and place in /public

export default function PhoneForm() {
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    const phoneNumber = Number(phone);

    if (isNaN(phoneNumber) || phone.length !== 10) {
      console.error("Invalid phone number");
      return;
    }

    try {
      const result = await checkUser(phoneNumber);
      if (result.success) {
        console.log("User verified");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }

    console.log("Phone number submitted:", phone);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Panel */}
      <div className="w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
        <Image
          src={logo}
          alt="Cabsy Logo"
          className="w-70 h-auto"
          priority
        />
        <h1 className="text-3xl font-bold text-[#bf360c]">Pin 2 Pin Cab Booking</h1>
        <ul className="text-[#4e342e] text-base leading-relaxed">
          <li>🚕 Affordable rides across your city</li>
          <li>📍 Instant location tracking by pincode</li>
          <li>🕒 24x7 Reliable service</li>
          <li>💳 Cashless & safe payments</li>
        </ul>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-6 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold text-center">User Login</h1>
          <h2 className="text-lg font-medium text-center text-zinc-300">Phone Verification</h2>

          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 focus:ring-2 focus:ring-white focus:outline-none rounded-xl px-4 py-2"
          />

          <Button
            type="submit"
            className="bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200"
          >
            Submit
          </Button>

          <a
            href="/user/signup/"
            className="text-sm text-center text-zinc-400 hover:text-white underline transition duration-150"
          >
            Don't have an account? Sign up
          </a>
        </form>
      </div>
    </div>
  );
}
