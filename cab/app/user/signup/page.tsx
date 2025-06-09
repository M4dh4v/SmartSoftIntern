'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { checkUser } from "./actions";

export default function PhoneForm() {
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = Number(phone);

    if (isNaN(phoneNumber)) {
      console.error("Invalid phone number");
      return;
    }

    try {
      const result = await addUser(phoneNumber);
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">Phone Verification</h2>
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="bg-black text-white border-zinc-700 placeholder-zinc-400"
        />
        <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
          Submit
        </Button>
      </form>
    </div>
  );
}
