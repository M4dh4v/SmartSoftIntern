'use server';

import { createClient } from "@/lib/supabase/client";
import { createClient as  cc } from "@supabase/supabase-js";

export async function addUser(
  userID: string,
  name: string,
  phoneNumber: number,
  address: string,
  city: string,
  pincode: number
) {
  const supabase = createClient(); // uses service role key internally
  const { error } = await supabase
    .from("user")
    .insert({
      id: userID,
      name,
      phoneNumber,
      address,
      city,
      onRide: false,
      pincode,
    });

  if (error) {
    console.error("addUser error:", error);
    return { success: false, message: "Failed to add user data" };
  } else {
    return { success: true, message: "User added" };
  }
}

export async function deleteUser(userID: string) {
  const supabase = cc(
    "https://hpoyutopxnqwocnwnvgp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb3l1dG9weG5xd29jbndudmdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg1MzIxOCwiZXhwIjoyMDY0NDI5MjE4fQ.gqUeaz9zBhfi04CcjR_puEiuDnK9smpPxsP5grKkWco"
  ); // service role key

  // Delete from auth.users
  const { error } = await supabase.auth.admin.deleteUser(userID);
  if (error) {
    console.error("deleteUser error:", error);
    return { success: false, message: "Failed to delete auth user" };
  }
  return { success: true, message: "User deleted from auth" };
}
