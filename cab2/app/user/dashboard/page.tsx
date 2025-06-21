import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import UserDashboard from "@/components/userDashboard";
import { verifyUser } from "../actions";

export default async function ProtectedPage() {

  await verifyUser()
  return <UserDashboard />;
}
