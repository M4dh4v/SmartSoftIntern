import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/navbar";
import { verifyUser } from "../actions";

export default async function ProtectedPage() {

  await verifyUser()
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <NavBar/>
     <p>Hi user</p>
    </div>
  );
}
