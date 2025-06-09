'use server';

import { createClient } from "@/lib/supabase/server";

export async function addUser(name:String,
    phoneNumber: Number,
    email: String, password: String,
    address: String, city: String, pincode: Number,
    onRide: Boolean,vehicleType:String, DrivingLicenceNo:String, VehicleNo:String
    ) {
  const supabase = await createClient();
  const {error } = await supabase
    .from("riders")
    .insert({name:name,
        phoneNumber:phoneNumber,
        email:email,
        address:address, 
        city:city, 
        password:password, onRide:onRide, pincode:pincode});



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
