import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {distance} from "@/distances/getDistance";


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

export async function makeNewRide(from:string | number, to: string | number, vtype: number){
    const d: number = parseFloat((await distance(from.toString(), to.toString()) ?? "0").toString());
    const price = 69 + (d*vtype)
    const supabase = await createClient()
    const {data:udata, error:uerror} = await supabase.auth.getUser()
    if(!udata.user?.id){
        return {
            success: false,
            message: uerror
        }
    }
    const uid = udata.user?.id

    const{error} = await supabase.from('rides')
    .insert({
        user: uid,
        from,
        to,
        distance: d,
        price,
        vehicleType: vtype
    })

    if (error)
    {
        return{
            success: false,
            message: error
        }
    }

    return {
        success: true,
        message: "working wow"
    }
}