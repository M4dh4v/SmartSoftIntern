// app/user/booking/[bookingid]/page.tsx
"use client";

import locationsList from "@/distances/locationsList";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";


export default function BookingPage() {
  const { bookingid } = useParams();
  const [ride, setRide] = useState<any>(null);
  const [rider, setRider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const locations = locationsList();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: rideData, error: rideErr } = await supabase
        .from("rides")
        .select()
        .eq("id", bookingid)
        .single();

      if (rideErr || !rideData) {
        setError(`Failed to load booking #${bookingid}: ${rideErr?.message}`);
        return;
      }

      setRide(rideData);

      const { data: riderData, error: riderErr } = await supabase
        .from("rider")
        .select()
        .eq("id", rideData.rider)
        .single();

      if (riderErr || !riderData) {
        setError(`Failed to load rider details: ${riderErr?.message}`);
        return;
      }

      setRider(riderData);
    };

    fetchData();
  }, [bookingid, supabase]);

  // Check if ride is finished every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("finished")
        .eq("id", bookingid)
        .single();

      if (data?.finished) {
        clearInterval(interval);
        router.push("/user/finish");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingid, router, supabase]);

  const getLocationName = (pincode: string) => {
    return locations.find((loc) => loc.pincode === pincode)?.location || pincode;
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
        <p className="text-center text-red-800 font-semibold">{error}</p>
      </div>
    );
  }

  if (!ride || !rider) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-8">
            Booking #{ride.id} Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ride Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
                🚗 Ride Info
              </h2>
              <dl className="space-y-3 text-gray-800 dark:text-gray-200">
                <div className="flex justify-between">
                  <dt className="font-medium">From</dt>
                  <dd>
                    {getLocationName(ride.from)} ({ride.from})
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">To</dt>
                  <dd>
                    {getLocationName(ride.to)} ({ride.to})
                  </dd>
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
                      ? "Finished"
                      : ride.active
                      ? "In Progress"
                      : "Pending"}
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

            {/* Rider Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                👶 Rider Info
              </h2>
              <dl className="space-y-3 text-gray-800 dark:text-gray-200">
                <div className="flex justify-between">
                  <dt className="font-medium">Name</dt>
                  <dd>{rider.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Phone</dt>
                  <dd>{rider.phoneNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">DL No.</dt>
                  <dd>{rider.DLno}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Vehicle No.</dt>
                  <dd>{rider.vehicleNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Checked by Admin</dt>
                  <dd>{rider.valid ? "✔️ Valid" : "❌ Invalid"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
