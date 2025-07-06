// /app/api/book/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, riderId } = body;

  if (!id || !riderId) {
    return NextResponse.json({ success: false, message: "Missing id or riderId" }, { status: 400 });
  }

  // Step 1: Fetch the ride by ID
  const { data: rides, error: fetchError } = await supabase
    .from("rides")
    .select("id, user, from, to, distance, price, vehicleType")
    .eq("id", id)
    .limit(1);

  if (fetchError || !rides || rides.length === 0) {
    return NextResponse.json({ success: false, message: "Ride not found" }, { status: 404 });
  }

  const ride = rides[0];

  // Step 2: Update the ride with riderId and set active = true
  const { error: updateError } = await supabase
    .from("rides")
    .update({
      rider: riderId,
      active: true,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ success: false, message: "Failed to update ride" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Ride successfully assigned", data: ride });
}
