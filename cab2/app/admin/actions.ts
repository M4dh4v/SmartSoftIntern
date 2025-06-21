import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";



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

export async function getNonValidRiders() {
    const supabase  = await createClient()
    const {data , error} = await supabase.from('rider').select('id').eq('valid',false)
    if (error){
        return error
    }
    // console.log(data)
    return data
}

export async function acceptRider({id} : {id:string|any}){
    const supabase = await createClient()
    const { error } = await supabase.from('rider').insert({vaid:true}).eq('id',id)
    if (error){
        return {
            success : false,
            message: error
        }
    }

    return {
        success:true,
        message :'rider accepted'
    }
}

export async function deleteRider({id}: {id:string|any}){
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    const {error:tabError} = await supabase.from('rider').delete().eq('id',id)
    if (tabError){
        return {
            success: false,
            message: tabError,
        }
    }
    const {error: authError} = await supabase.auth.admin.deleteUser(id)
    if(authError){
        return{
            success: false,
            message: authError
        }
    }

    return{
        success: true,
        message: "Rider has been deleted"
    }
}
export async function deleteUser({id}: {id:string|any}){
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    const {error:tabError} = await supabase.from('user').delete().eq('id',id)
    if (tabError){
        return {
            success: false,
            message: tabError,
        }
    }
    const {error: authError} = await supabase.auth.admin.deleteUser(id)
    if(authError){
        return{
            success: false,
            message: authError
        }
    }

    return{
        success: true,
        message: "User has been deleted"
    }
}

