// app/api/rides/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: rides, error } = await supabase
      .from("rides")
      .select("id, user, from, to, distance, price, vehicleType");

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: rides });
  } catch (err: any) {
    console.error("[/api/rides GET] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { from, to, vehicle, price, distance } = await req.json();

    // auth check…
    const supabase = await createClient();
    const { data: userData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !userData.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }
    const uid = userData.user.id;

    // map vehicle → vtype …
    let vtype = 0;
    switch (vehicle) {
      case "Hatchback/Sedan":    vtype = 1; break;
      case "SUV / 7-Seater":     vtype = 2; break;
      case "Premium Sedan":      vtype = 3; break;
      case "Premium SUV":        vtype = 4; break;
    }

    // insert…
    const { error: insertErr } = await supabase.from("rides").insert({
      user: uid,
      from, to, distance, price, vehicleType: vtype,
    });

    if (insertErr) {
      return NextResponse.json(
        { success: false, message: insertErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ride booked successfully",
    });
  } catch (err: any) {
    console.error("[/api/rides POST] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
