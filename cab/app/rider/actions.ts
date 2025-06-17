'use server';

import { createClient } from "@/lib/supabase/client";

export async function addRider(
                                userID:String,
                                name:String,
                                phoneNumber: Number,
                                address: String, 
                                city: String, 
                                pincode: Number,
                                ) {
  const supabase = await createClient();
  const {error } = await supabase
    .from("rider")
    .insert({
      id:userID,
      name:name,
        phoneNumber:phoneNumber,
        address:address, 
        city:city, 
        onRide:false, 
        pincode:pincode});



  console.log(error);

  if (error) {
    return {
      success: false,
      message: "User not not added",
    };
  } else {
    return {
      success: false,
      message: "User added",
    };
  }
}
