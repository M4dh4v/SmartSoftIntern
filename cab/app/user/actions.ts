'use server';

import { getSupabaseClient } from "@/lib/supabase/server";

export async function checkUser(phoneNumber: number) {
  const supabase = await getSupabaseClient();
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
}export async function signup(formData: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  city: string;
  pincode: string;
}, role: 'user') {
  const supabase = await getSupabaseClient();

  // Validate input data
  if (!formData.name || formData.name.length < 2) {
    return {
      success: false,
      message: 'Name must be at least 2 characters long'
    };
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address'
    };
  }

  if (formData.password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
    return {
      success: false,
      message: 'Please enter a valid 10-digit phone number'
    };
  }

  const pincode = parseInt(formData.pincode);
  if (isNaN(pincode) || formData.pincode.length !== 6) {
    return {
      success: false,
      message: 'Please enter a valid 6-digit pincode'
    };
  }

  // First create user in auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        phoneNumber: formData.phoneNumber,
        role: role
      }
    }
  });

  if (authError) {
    return {
      success: false,
      message: authError.message
    };
  }

  if (!authData?.user) {
    return {
      success: false,
      message: "Failed to create user account"
    };
  }

  // Now insert into public.user with the same id
  const { error: userError } = await supabase
    .from('user')
    .insert({
      id: authData.user.id,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      pincode: parseInt(formData.pincode),
      onRide: false,
      role: role
    });

  if (userError) {
    // If user table insertion fails, clean up auth.users
    try {
      await supabase.auth.admin.deleteUser(authData.user.id);
    } catch (cleanupError) {
      console.error('Failed to clean up auth user:', cleanupError);
    }
    return {
      success: false,
      message: userError.message || 'Failed to create user profile'
    };
  }

  return {
    success: true,
    message: "User created successfully"
  };
}
