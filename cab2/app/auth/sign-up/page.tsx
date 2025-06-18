import { SignUpFormAdmin} from "@/components/sign-up-form";
import { verifyNotSignedIn } from "../actions";

export default async function Page() {
    // await verifyNotSignedIn()
  
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpFormAdmin />
      </div>
    </div>
  );
}
