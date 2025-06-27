import { LoginForm } from "@/components/login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NavBar from "@/components/navbar"

export default async function Page() {

  async function checkUser() {
  const supabase = await createClient()
  const {data, error} = await supabase.auth.getUser()
  if(data?.user?.user_metadata.role == "user")
  {
    redirect("/user/dashboard")
  }
  else if(data?.user?.user_metadata.role == "rider")
  {
    redirect("/rider/dashboard")
  }
  else if(data?.user?.user_metadata.role == "admin")
  {
    redirect('/admin')
  }
  }

 await checkUser()
  

  return (
    <>
      <NavBar />

    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full ">
        <LoginForm />
      </div>
    </div>
    </>
  );
}
