'use client';

import { useState } from "react";
import { SignUpForm, SignUpFormData } from "@/components/sign-up-form-user";
import { addUser, deleteUser } from "./actions"; // These run on server
import logo from "@/app/public/logow.png";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const supabase = createClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddUser = async (formData: SignUpFormData): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/protected`
          : undefined;

      // 1. Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      if (!data?.user?.id) throw new Error("User ID not returned");

      const userId = data.user.id;

      // 2. Validate inputs
      const phone = Number(formData.phoneNumber);
      const pin = Number(formData.pincode);
      if (isNaN(phone) || isNaN(pin)) throw new Error("Invalid phone or pincode");

      // 3. Insert into your "user" table (server action)
      const result = await addUser(
        userId,
        formData.name,
        phone,
        formData.address,
        formData.city,
        pin
      );

      if (!result.success) {
        // Rollback: delete auth user
        await deleteUser(userId);
        throw new Error(result.message || "umber already registered");
      }

      setSuccessMessage("Signup successful!");
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-black flex items-center justify-center">
        <Image src={logo} alt="Logo" width={300} height={300} />
      </div>

      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <SignUpForm onSubmit={handleAddUser} />
          {errorMessage && (
            <div className="mt-4 text-red-500 font-medium">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mt-4 text-green-500 font-medium">{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
