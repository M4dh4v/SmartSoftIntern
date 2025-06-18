import { SignUpFormUser } from "@/components/sign-up-form-user";
import { verifyNotSignedIn } from "../actions";

export default async function Page() {
      // await verifyNotSignedIn()
  
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full h-full">
        <SignUpFormUser />
      </div>
    </div>
  );
}
