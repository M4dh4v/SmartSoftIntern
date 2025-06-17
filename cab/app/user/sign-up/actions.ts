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
  console.log(`[${new Date().toISOString()}] Starting ${role} signup for:`, formData.email);
  
  const supabase = await getSupabaseClient();
  if (!supabase) {
    console.error('Failed to initialize Supabase client');
    return { success: false, message: 'Failed to initialize authentication service' };
  }

  // Validate input data
  try {
    // Basic validations
    if (!formData.name || formData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (formData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      throw new Error('Please enter a valid 10-digit phone number');
    }

    const pincodeStr = String(formData.pincode).trim();
    const pincode = parseInt(pincodeStr);
    if (isNaN(pincode) || pincodeStr.length !== 6) {
      throw new Error('Please enter a valid 6-digit pincode');
    }

    // Role-specific validations
    if (role === 'rider') {
      const vehicleTypeNum = Number(formData.vehicleType);
      if (!vehicleTypeNum || isNaN(vehicleTypeNum)) {
        throw new Error('Please select a valid vehicle type');
      }
      

      // Attach numeric enum to formData for later insert
      (formData as any)._vehicleTypeEnum = vehicleTypeNum;
    }
  } catch (validationError) {
    const errorMessage = validationError instanceof Error ? validationError.message : 'Invalid form data';
    console.error('Validation error:', errorMessage);
    return { success: false, message: errorMessage };
  }

  // Create user in auth.users
  console.log('Creating auth user...');
  try {
    // Get the base URL from environment variables or use a default
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${siteUrl}/auth/callback`;
    
    console.log('Using redirect URL:', redirectUrl);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.name.trim(),
          phone: formData.phoneNumber.trim(),
          role: role
        },
        emailRedirectTo: redirectUrl
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(authError.message || 'Failed to create authentication account');
    }

    if (!authData?.user) {
      console.error('No user data returned from auth signup');
      throw new Error('Failed to create user account - no user data returned');
    }

    console.log('Auth user created with ID:', authData.user.id);

    // Insert into the appropriate profile table
    const table = role === 'user' ? 'user' : 'rider';
    const profileData: any = {
      id: authData.user.id,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: parseInt(formData.pincode)
    };

    // Add rider-specific fields if needed
    if (role === 'rider') {
      profileData.vehicleType = (formData as any)._vehicleTypeEnum ?? 0
      profileData.vehicleNumber = formData.VehicleNo?.trim() || '';
      profileData.DLno = formData.DrivingLicenceNo?.trim() || '';
      profileData.onRoad = false;
    } else {
      // User-specific fields if any
      profileData.onRide = false;
    }

    console.log(`Inserting into ${table} table:`, profileData);
    const { error: profileError } = await supabase
      .from(table)
      .insert(profileData);

    if (profileError) {
      console.error(`Failed to create ${role} profile:`, profileError);
      
      // Attempt to clean up auth user if profile creation fails
      try {
        console.log('Attempting to clean up auth user due to profile creation failure');
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to clean up auth user:', cleanupError);
        // Continue with the original error
      }
      
      throw new Error(
        profileError.message || 
        profileError.details || 
        profileError.hint || 
        `Failed to create ${role} profile`
      );
    }

    console.log(`Successfully created ${role} profile for:`, formData.email);
    return {
      success: true,
      message: `Successfully created ${role} account! Please check your email to verify your account.`
    };

  } catch (error) {
    console.error('Error during signup process:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred during signup'
    };
  }

  return {
    success: true,
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
  };
}
