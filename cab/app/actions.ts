'use server';

import { signup as userSignup } from './user/sign-up/actions';
import {redirect} from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export async function decideUser(userId: string) {
  console.log('decideUser called with id:', userId);
  if (!userId) {
    console.error('No user ID provided to decideUser');
    return '/auth/login?error=No user ID provided';
  }

  try {
    const supabase = createClient();
    console.log('UID : ',userId)

    // Check user table using email
    const { data: userData } = await supabase
      .from('user')
      .select()
      .eq('id', userId).single();

    if (userData) {
      console.log('User found in user table, redirecting to user dashboard');
      return '/user/dashboard';
    }

    // Check rider table using email
    const { data: riderData } = await supabase
      .from('rider')
      .select()
      .eq('id', userId);

    if (riderData) {
      console.log('User found in rider table, redirecting to rider dashboard');
      return '/rider/dashboard';
    }
    
  } catch (error) {
    console.error('Error in decideUser:', error);
    return '/protected';
  }
}


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
  console.log('Starting signup process for role:', role);
  console.log('Form data received:', JSON.stringify(formData, null, 2));

  try {
    // Validate required fields
    const requiredFields = ['name', 'phoneNumber', 'email', 'password', 'address', 'city', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation error:', errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }

    // Ensure all fields are strings
    const parsedFormData = {
  name: formData.name.toString().trim(),
  phoneNumber: formData.phoneNumber.toString().trim(),
  email: formData.email.toString().trim().toLowerCase(),
  password: formData.password.toString(),

  address: formData.address.toString().trim(),
  city: formData.city.toString().trim(),
  pincode: parseInt(formData.pincode.toString().trim(), 10) || 0,

  vehicleType: formData.vehicleType ? parseInt(formData.vehicleType.toString().trim(), 10) : null,
  vehicleNumber: formData.VehicleNo?.toString().trim() || null,
  DLno: formData.DrivingLicenceNo?.toString().trim() || null,

  onRide: false,
  onRoad: false,
};


    console.log('Processed form data:', parsedFormData);

    // Call the appropriate signup function based on role
    try {
      const result = await userSignup(parsedFormData, role);
      console.log('Signup result:', result);
      
      if (result.success) {
        console.log('Signup successful, redirecting to login');
        // Use window.location for client-side redirect since this is called from client
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return result;
      }
      
      return result;
    } catch (signupError) {
      console.error('Error in userSignup:', signupError);
      throw signupError; // This will be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Signup process failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      message: errorMessage
    };
  }
}