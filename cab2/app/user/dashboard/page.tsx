import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import UserDashboard from "@/components/userDashboard";
import { verifyUser } from "../actions";
import NavBar from "@/components/navbar";

export default async function ProtectedPage() {

  await verifyUser()
  return ( 
  <div className="min-h-screen bg-[#fff4e6] text-[#4e342e] p-6">
    <NavBar />
  <UserDashboard />
    </div>
  );
}
