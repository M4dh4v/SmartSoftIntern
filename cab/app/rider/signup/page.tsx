'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addUser } from "./actions";
import Image from "next/image";
import logo from "@/app/public/logo.png"; 

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
    vehicleType: "",
    DrivingLicenceNo: "",
    VehicleNo: ""
  });

  const [statusMessage, setStatusMessage] = useState("");

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

    const {
      name,
      phoneNumber,
      email,
      password,
      address,
      city,
      pincode,
      onRide,
      vehicleType,
      DrivingLicenceNo,
      VehicleNo
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
        onRide,
        vehicleType,
        DrivingLicenceNo,
        VehicleNo
      );
      setStatusMessage(result.message);
    } catch (error) {
      console.error("Error adding user:", error);
      setStatusMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      {/* Left Half - Info / Branding */}
      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col justify-center items-center text-center px-10 py-12">
        <h1 className="text-4xl font-bold mb-4">Join as a Rider</h1>
        <p className="text-lg text-zinc-400">
          Drive with us and start earning today. <br /> Manage your rides, customers, and vehicle all in one place.
        </p>
        {/* Add an image/logo here if needed */}
        <div className="mt-8">
          <Image src={logo} alt="Rider Illustration" className="w-3/4 mx-auto" />
        </div>
      </div>

      {/* Right Half - Signup Form */}
      <div className="w-1/2 bg-black flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-6 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold text-center">Rider Signup</h1>

          <Input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="phoneNumber" type="tel" maxLength={10} placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />
          <Input name="pincode" type="text" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className="bg-black text-white border border-zinc-500 placeholder-zinc-500 rounded-xl px-4 py-2" />

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="bg-black text-white border border-zinc-500 rounded-xl px-4 py-2"
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option value="sedan-4">Sedan - 4 Seater</option>
            <option value="suv-7">SUV - 7 Seater</option>
            <option value="premium-4">Premium - 4 Seater</option>
            <option value="premium-7">Premium - 7 Seater</option>
          </select>

          <Input name="DrivingLicenceNo" type="text" placeholder="Driving Licence Number" value={formData.DrivingLicenceNo} onChange={handleChange} className="bg-black text-white border border-zinc-500 rounded-xl px-4 py-2" />
          <Input name="VehicleNo" type="text" placeholder="Vehicle Number" value={formData.VehicleNo} onChange={handleChange} className="bg-black text-white border border-zinc-500 rounded-xl px-4 py-2" />

          <Button type="submit" className="bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200">Sign Up</Button>

          {statusMessage && (
            <p className="text-sm text-center text-zinc-400">{statusMessage}</p>
          )}

          <a href="/user/login/" className="text-sm text-center text-zinc-400 hover:text-white underline transition duration-150">
            Already have an account? Log in
          </a>
        </form>
      </div>
    </div>
  );
}
