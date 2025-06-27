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

export async function makeNewRide(
  from: string | number,
  to: string | number,
  distance: number,
  vehicle: string,
  price: number | null
) {

  const supabase = await createClient()
  const { data: udata, error: uerror } = await supabase.auth.getUser()
  if (uerror || !udata.user?.id) {
    return { success: false, message: uerror?.message ?? "Not logged in" }
  }

  const uid = udata.user.id

  // Fix your vtype logic (`=` is assignment; use `===`)
  let vtype = 0
  if (vehicle === "Hatchback/Sedan") vtype = 1
  else if (vehicle === "SUV / 7-Seater") vtype = 2
  else if (vehicle === "Premium Sedan") vtype = 3
  else if (vehicle === "Premium SUV") vtype = 4

  const { error: insertError } = await supabase.from("rides").insert({
    user: uid,
    from,
    to,
    distance,
    price,
    vehicleType: vtype,
  })

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  return { success: true, message: "Ride booked successfully" }
}
