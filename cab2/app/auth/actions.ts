import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function verifyNotSignedIn(){
    const supabase = await createClient()

    const {data,error} =  await supabase.auth.getUser()
    if (data?.user)
    {
        redirect("/")
    }
    else{
        return
    }
}