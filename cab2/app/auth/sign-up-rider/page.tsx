import { SignUpFormRider } from "@/components/sign-up-form-rider";
import { verifyNotSignedIn } from "../actions";

export default async function Page() {
  // await verifyNotSignedIn()
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full h-full">
        <SignUpFormRider />
      </div>
    </div>
  );
}
