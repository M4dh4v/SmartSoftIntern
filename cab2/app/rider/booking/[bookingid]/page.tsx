import locationsList from "@/distances/locationsList";
import { createClient } from "@/lib/supabase/server";
import { FinishRideButton } from "./finishedButton";

interface Props {
  params: { bookingid: string };
}

export default async function BookingPage({params,}: {params: Promise<{ bookingid: string }>;}) {
  const supabase = await createClient();
  const locations = locationsList();
    const {bookingid} = await params
  // 1) Load the ride
  const { data: ride, error: rideErr } = await supabase
    .from("rides")
    .select()
    .eq("id", bookingid)
    .single();

  if (rideErr || !ride) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
        <p className="text-center text-red-800 font-semibold">
          Failed to load booking #{bookingid}: {rideErr?.message}
        </p>
      </div>
    );
  }

  // 2) Load the user
  const { data: user, error: userErr } = await supabase
    .from("user")
    .select()
    .eq("id", ride.user)
    .single();

  if (userErr || !user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
        <p className="text-center text-red-800 font-semibold">
          Failed to load user details: {userErr?.message}
        </p>
      </div>
    );
  }

  // Helper to get name from pincode
  const getLocationName = (pincode: string) => {
    return locations.find(loc => loc.pincode === pincode)?.location || pincode;
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-8">
            Booking #{ride.id} Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ride Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">🚗 Ride Info</h2>
              <dl className="space-y-3 text-gray-800 dark:text-gray-200">
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
                  <dd>{ride.finished ? "Finished" : ride.active ? "In Progress" : "Pending"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Vehicle Type</dt>
                  <dd>{["Unknown","Hatchback/Sedan","SUV / 7-Seater","Premium Sedan","Premium SUV"][ride.vehicleType]}</dd>
                </div>
              </dl>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">👶 User Info</h2>
              <dl className="space-y-3 text-gray-800 dark:text-gray-200">
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
      </div>

      {/* Finish Button */}
      <div className="absolute bottom-8 right-8">
        <FinishRideButton rideId={ride.id} />
      </div>
    </div>
  );
}