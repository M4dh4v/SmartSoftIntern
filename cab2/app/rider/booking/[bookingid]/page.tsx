import locationsList from "@/distances/locationsList";
import { createClient } from "@/lib/supabase/server";
import { FinishRideButton } from "./finishedButton";
import NavBar from "@/components/navbar";
import Image from "next/image";
import logo from "@/public/logow.png";

export default async function BookingPage({ params }: { params: { bookingid: string } }) {
  const supabase = await createClient();
  const locations = locationsList();
  const { bookingid } = await params;

  const { data: ride, error: rideErr } = await supabase
    .from("rides")
    .select()
    .eq("id", bookingid)
    .single();

  if (rideErr || !ride) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg">
        <p className="text-center font-semibold">
          Failed to load booking #{bookingid}: {rideErr?.message}
        </p>
      </div>
    );
  }

  const { data: user, error: userErr } = await supabase
    .from("user")
    .select()
    .eq("id", ride.user)
    .single();

  if (userErr || !user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg">
        <p className="text-center font-semibold">
          Failed to load user details: {userErr?.message}
        </p>
      </div>
    );
  }

  const getLocationName = (pincode: string) => {
    return locations.find((loc) => loc.pincode === pincode)?.location || pincode;
  };

  return (
    <>
    <NavBar />
    <div className="relative min-h-screen bg-[#fff4e6] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="logo" width={120} height={120} className="drop-shadow-xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-[#bf360c] mb-10">
          Booking  Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ride Info */}
          <div className="bg-[#ffebd6] border border-orange-300 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-[#bf360c] mb-4">🚕 Ride Information</h2>
            <dl className="space-y-3 text-[#4e342e] text-base">
              <div className="flex justify-between">
                <dt className="font-medium">From</dt>
                <dd>{getLocationName(ride.from)} ({ride.from})</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">To</dt>
                <dd>{getLocationName(ride.to)} ({ride.to})</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Date</dt>
                <dd>{ride.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Distance</dt>
                <dd>{ride.distance} km</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fare</dt>
                <dd>₹{ride.price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Status</dt>
                <dd>
                  {ride.finished
                    ? "✅ Finished"
                    : ride.active
                    ? "🟢 In Progress"
                    : "🕒 Pending"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Vehicle Type</dt>
                <dd>
                  {[
                    "Unknown",
                    "Hatchback/Sedan",
                    "SUV / 7-Seater",
                    "Premium Sedan",
                    "Premium SUV",
                  ][ride.vehicleType]}
                </dd>
              </div>
            </dl>
          </div>

          {/* User Info */}
          <div className="bg-[#ffebd6] border border-green-300 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">🧑‍💼 User Information</h2>
            <dl className="space-y-3 text-[#3e3e3e] text-base">
              <div className="flex justify-between">
                <dt className="font-medium">Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Phone</dt>
                <dd>{user.phoneNumber}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Finish Button */}
      <div className="absolute bottom-8 right-8">
        <FinishRideButton rideId={ride.id} />
      </div>
    </div>
    </>
  );
}
