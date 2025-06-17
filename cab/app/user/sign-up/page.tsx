'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { SignUpForm } from '@/components/sign-up-form';
import type { SignUpFormData } from '@/components/sign-up-form';
import { signup } from '@/app/actions';

export default function SignUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (formData: SignUpFormData) => {
    console.log('Form submitted with data:', formData);
    
    // Client-side validation
    if (formData.password !== formData.repeatPassword) {
      toast.error('Passwords do not match');
      return { success: false, message: 'Passwords do not match' };
    }
    
    setIsSubmitting(true);
    
    try {
      // Remove repeatPassword as it's not needed in the signup action
      const { repeatPassword, ...signupData } = formData;
      
      console.log('Calling signup action with:', signupData);
      const result = await signup(signupData, 'user');
      console.log('Signup result:', result);
      
      if (result.success) {
        toast.success(result.message || 'Account created successfully! Please check your email to verify your account.');
        // Redirect to login after a short delay to show the success message
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to create account. Please try again.');
      }
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return <SignUpForm onSubmit={handleSignup} className={isSubmitting ? 'opacity-70 pointer-events-none' : ''} />;
}
