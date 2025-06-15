'use server';

import { signup as userSignup } from './user/sign-up/actions';
import {redirect} from 'next/navigation';

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
  try {
    // Validate required fields
    if (!formData.name || !formData.phoneNumber || !formData.email || !formData.password || !formData.address || !formData.city || !formData.pincode) {
      return {
        success: false,
        message: 'Please fill in all required fields'
      };
    }

    // Ensure all fields are strings
    const parsedFormData = {
      name: formData.name.toString(),
      phoneNumber: formData.phoneNumber.toString(),
      email: formData.email.toString(),
      password: formData.password.toString(),
      address: formData.address.toString(),
      city: formData.city.toString(),
      pincode: formData.pincode.toString(),
      vehicleType: formData.vehicleType?.toString() || '',
      DrivingLicenceNo: formData.DrivingLicenceNo?.toString() || '',
      VehicleNo: formData.VehicleNo?.toString() || ''
    };

    if (role === 'user') {
      const result = await userSignup(parsedFormData, 'user');
      if (result.success) {
        redirect('/auth/login');
      }
      return result;
    } else if (role === 'rider') {
      const result = await userSignup(parsedFormData, 'rider');
      if (result.success) {
        redirect('/auth/login');
      }
      return result;
    }

    return {
      success: false,
      message: 'Invalid role specified'
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    };
  }
}