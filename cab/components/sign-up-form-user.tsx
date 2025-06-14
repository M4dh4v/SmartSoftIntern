'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export interface SignUpFormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
  city: string;
  pincode: string;
  onRide: boolean;
}

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<string>;
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
    onRide: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
    const message = await onSubmit(formData);
    setIsLoading(false);

    if (message.toLowerCase().includes('success')) {
      toast.success(message);
      setTimeout(() => {
        router.push('/user/sign-up-success');
      }, 1000); // Delay to allow toast to show
    } else {
      toast.error(message);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full flex flex-col gap-6 text-white"
      >
        <h1 className="text-2xl font-bold text-center">User Signup</h1>

        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <Input name="phoneNumber" type="tel" maxLength={10} placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <Input name="repeatPassword" type="password" placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} required />
        <Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

        <Button type="submit" disabled={isLoading}>
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
  );
}
