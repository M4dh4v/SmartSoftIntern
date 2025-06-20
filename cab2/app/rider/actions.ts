import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkValid() {

    const supabase = await createClient()
    const {data,error:serror} = await supabase.auth.getUser()
    console.log(serror)
    if(serror)
    {
        return redirect('/auth/login')
            console.log(data)

    }
    const role = data.user.user_metadata.role
    console.log(role)
if (role !== "admin" && role !== "rider")
    {
        return redirect('/corrupt-account')
    }
    return
}

export async function checkAccept(){
    const supabase = await createClient()
    const {data} = await supabase.auth.getUser()
    const {data: udata, error:uerror} = await supabase.from('rider').select().eq('id',data.user?.id)
    const rider= udata?.[0]
    if(rider.valid){
        return
    }
    else{
        return redirect('/rider/admin-approval')
    }
}