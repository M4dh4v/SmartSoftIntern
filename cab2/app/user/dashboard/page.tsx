import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  else if(data?.user.user_metadata.role != "user")
  {
    redirect("/corrupt account")
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
     <p>Hi user</p>
    </div>
  );
}
