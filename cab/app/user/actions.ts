'use server';

import { createClient } from "@/lib/supabase/server";

export async function checkUser(phoneNumber: number) {
  const supabase = await createClient();
  const { data, status, error } = await supabase
    .from("user")
    .select()
    .eq("phoneNumber", phoneNumber);

  console.log(status);

  if (error) {
    return {
      success: false,
      message: "User not found on DB",
    };
  } else if (status === 200 && data.length > 0) {
    return {
      success: true,
      message: "User found",
    };
  } else {
    return {
      success: false,
      message: "User not found",
    };
  }
}
