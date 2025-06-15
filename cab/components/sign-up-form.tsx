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

    if (
      isNaN(Number(formData.phoneNumber)) ||
      formData.phoneNumber.length !== 10 ||
      isNaN(Number(formData.pincode))
    ) {
      toast.error('Invalid phone number or pincode');
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(formData);
      setIsLoading(false);

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          router.push('/user/sign-up-success');
        }, 1000);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'An unexpected error occurred');
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

          <Button type="submit" disabled={isLoading} className="bg-white text-black font-semibold py-2 rounded-xl hover:bg-zinc-200 transition duration-200">
            {isLoading ? 'Signing up...' : 'Sign Up'}
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
