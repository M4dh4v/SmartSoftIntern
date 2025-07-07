"use client";

import locationsList from "@/distances/locationsList";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logow.png";
import NavBar from "@/components/navbar";

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
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg">
        <p className="text-center font-semibold">{error}</p>
      </div>
    );
  }

  if (!ride || !rider) return null;

  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-[#fff4e6] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="logo" width={120} height={120} className="drop-shadow-xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-[#bf360c] mb-10">
          Booking #{ride.id} Details
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
                    "Hatchback / Sedan",
                    "SUV / 7-Seater",
                    "Premium Sedan",
                    "Premium SUV",
                  ][ride.vehicleType]}
                </dd>
              </div>
            </dl>
          </div>

          {/* Rider Info */}
          <div className="bg-[#ffebd6] border border-green-300 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">🧑‍✈️ Rider Information</h2>
            <dl className="space-y-3 text-[#3e3e3e] text-base">
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
                <dd>{rider.valid ? "✅ Valid" : "❌ Invalid"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div></>
  );
}
