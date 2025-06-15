'use client';

import { SignUpForm } from '@/components/sign-up-form';
import type { SignUpFormData } from '@/components/sign-up-form';
import { signup } from '@/app/actions';

interface SignUpResult {
  success: boolean;
  message: string;
}

export default function SignUpPage() {
  return <SignUpForm onSubmit={(formData) => signup(formData, 'user')} />;
}
