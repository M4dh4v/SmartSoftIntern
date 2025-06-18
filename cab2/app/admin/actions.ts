import { createClient } from "@/lib/supabase/server";


export async function getAllRiders() {
    
    const supabase = await createClient()
    const {data,error} = await supabase.from('rider').select()
    if (error){
        return "Data retrieve failed"
    }
    return data
}

export async function getAllUsers() {
    const supabase = await createClient()
    const {data,error} = await supabase.from('user').select()
    if (error){
        return "Data retrieve failed"
    }
    return data
}