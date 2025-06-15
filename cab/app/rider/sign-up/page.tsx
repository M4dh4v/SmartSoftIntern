

import SignUpForm, { SignUpFormData } from '@/components/sign-up-form-rider';
import { handleRiderSignUp } from './actions';

export default function SignUpPage() {
  return <SignUpForm onSubmit={handleRiderSignUp as (data: SignUpFormData) => Promise<{success:boolean; message:string}>} />;
}
