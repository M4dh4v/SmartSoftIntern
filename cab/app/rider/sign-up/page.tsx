'use client';

import SignUpForm, { SignUpFormData } from '@/components/sign-up-form-rider';

export default function SignUpPage() {
  // Mock onSubmit function simulating an API call
  const handleSignUp = async (formData: SignUpFormData): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would call your backend API to create a user/rider
    console.log('Submitted form data:', formData);

    // Simulate success message
    return 'Signup successful';
  };

  return <SignUpForm onSubmit={handleSignUp} />;
}
