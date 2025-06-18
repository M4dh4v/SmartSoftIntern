import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export async function verifyUser() {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getUser()
    if (data?.user?.user_metadata.role == "user" || data?.user?.user_metadata.role =="admin")
    {
        return;
    }
    else if(data?.user?.user_metadata.role =="rider")
    {
        redirect("/rider/dashboard")
    }
    else{
        redirect("/corrupt-account")
    }
}