'use server'
import { createClient } from "@/lib/supabase/server";

export default async function getUserAndName(){
    'use server'
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const role: string = (user?.user_metadata.role)
    const uid = user?.id
    const {data: namedata, error}= await supabase.from(role).select('name').eq('id',uid).single()
    const name : string = namedata?.name || "Admin"
    return { user, name }
  }
