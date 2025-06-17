'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import logo from '@/app/public/logow.png';

export interface SignUpFormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
  city: string;
  pincode: string;
  vehicleType?: string;
  DrivingLicenceNo?: string;
  VehicleNo?: string;
}

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<{
    success: boolean;
    message: string;
  }>;
  className?: string;
}

export function SignUpForm({ onSubmit, className }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    repeatPassword: '',
    address: '',
    city: '',
    pincode: '',
    vehicleType: '',
    DrivingLicenceNo: '',
    VehicleNo: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.address || formData.address.trim().length < 5) {
      toast.error('Please enter a valid address');
      return;
    }

    if (!formData.city || formData.city.trim().length < 2) {
      toast.error('Please enter a valid city name');
      return;
    }

    try {
      setIsLoading(true);
      const result = await onSubmit(formData);
      
      // The success/error handling is now done in the page component
      if (!result.success) {
        // If we get here, it means the API call succeeded but returned success: false
        toast.error(result.message || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'An error occurred while submitting the form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
        <Image src={logo} alt="Cabsy Logo" className="w-70 h-auto" priority />
        <h1 className="text-3xl font-bold text-[#bf360c]">Pin 2 Pin Cab Booking</h1>
        <ul className="text-[#4e342e] text-base leading-relaxed">
          <li>🚕 Affordable rides across your city</li>
          <li>📍 Instant location tracking by pincode</li>
          <li>🕒 24x7 Reliable service</li>
          <li>💳 Cashless & safe payments</li>
        </ul>
      </div>

      <div className="w-1/2 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 transition-all duration-300"
        >
          <h1 className="text-2xl font-bold text-center">Create User Account</h1>

          <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input name="phoneNumber" type="tel" maxLength={10} placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <Input name="repeatPassword" type="password" placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} required />
          <Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

          <Button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Sign Up'}
          </Button>

          <div className="mt-4 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/user/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
