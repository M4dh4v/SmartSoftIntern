'use server';

import { signup } from '@/app/actions';

export async function handleRiderSignUp(formData: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
  city: string;
  pincode: string;
  vehicleType: string;
  DrivingLicenceNo: string;
  VehicleNo: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    return await signup(formData, 'rider');
  } catch (error) {
    console.error('Sign-up error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
