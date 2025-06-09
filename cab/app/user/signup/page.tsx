'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addUser } from "./actions";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    city: "",
    pincode: "",
    onRide: false,
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      phoneNumber,
      email,
      password,
      address,
      city,
      pincode,
      onRide,
    } = formData;

    if (
      isNaN(Number(phoneNumber)) ||
      phoneNumber.length !== 10 ||
      isNaN(Number(pincode))
    ) {
      setStatusMessage("Invalid phone number or pincode");
      return;
    }

    try {
      
      const result = await addUser(
        name,
        Number(phoneNumber),
        email,
        password,
        address,
        city,
        Number(pincode),
        onRide
      );
      setStatusMessage(result.message);
    } catch (error) {
      console.error("Error adding user:", error);
      setStatusMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Empty */}
      <div className="w-1/2 bg-black"></div>

      {/* Right Half - Signup Form */}
      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-6 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold text-center">User Signup</h1>

          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="phoneNumber"
            type="tel"
            maxLength={10}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

          <Input
            name="pincode"
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2"
            required
          />

        
          <Button
            type="submit"
            className="bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200"
          >
            Sign Up
          </Button>

          {statusMessage && (
            <p className="text-sm text-center text-zinc-400">{statusMessage}</p>
          )}

          <a
            href="/user/login/"
            className="text-sm text-center text-zinc-400 hover:text-white underline transition duration-150"
          >
            Already have an account? Log in
          </a>
        </form>
      </div>
    </div>
  );
}
