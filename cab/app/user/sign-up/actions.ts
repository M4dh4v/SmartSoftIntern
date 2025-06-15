'use server';

import { getSupabaseClient } from '@/lib/supabase/server';

export async function signup(formData: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  city: string;
  pincode: string;
  vehicleType?: string;
  DrivingLicenceNo?: string;
  VehicleNo?: string;
}, role: 'user' | 'rider'): Promise<{ success: boolean; message: string }> {
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

  if (role === 'rider') {
    // Validate rider-specific fields
    if (!formData.vehicleType) {
      return {
        success: false,
        message: 'Please select a vehicle type'
      };
    }

    if (!formData.DrivingLicenceNo || formData.DrivingLicenceNo.length < 10) {
      return {
        success: false,
        message: 'Please enter a valid driving licence number'
      };
    }

    if (!formData.VehicleNo || formData.VehicleNo.length < 5) {
      return {
        success: false,
        message: 'Please enter a valid vehicle number'
      };
    }
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

  // Now insert into appropriate table with the same id
  const table = role === 'user' ? 'user' : 'rider';
  const { error: profileError } = await supabase
    .from(table)
    .insert({
      id: authData.user.id,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      pincode: parseInt(formData.pincode),
      onRide: false,
      ...(role === 'rider' && {
        vehicleType: 0,
        vehicleNumber: formData.VehicleNo,
        DLno: formData.DrivingLicenceNo,
        onRoad: false
      })
    });

  if (profileError) {
    // If profile table insertion fails, clean up auth.users
    try {
      await supabase.auth.admin.deleteUser(authData.user.id);
    } catch (cleanupError) {
      console.error('Failed to clean up auth user:', cleanupError);
    }
    return {
      success: false,
      message: profileError.message || profileError.details || profileError.hint || `Failed to create ${role} profile`
    };
  }

  return {
    success: true,
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
  };
}
