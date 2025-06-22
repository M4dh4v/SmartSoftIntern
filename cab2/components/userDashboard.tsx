"use client";

import { useState, useEffect } from "react";
import { makeNewRide } from "@/app/user/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { distance } from "@/distances/getDistance";
import locationsList from "@/distances/locationsList";

export default function UserDashboard() {
  const router = useRouter();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [dd, setDd] = useState<number | null>(null);
  const [vehicleType, setVehicleType] = useState<number>(1);
  const [message, setMessage] = useState<string>("");

  const pincodeOptions1 = locationsList();
  const pincodeOptions2 = locationsList();

  // Recalculate distance any time `from` or `to` changes
  useEffect(() => {
    if (from && to) {
      distance(from, to).then((d) => {
        setDd(d);
      }).catch((err) => {
        console.error("distance error:", err);
        setDd(null);
      });
    } else {
      setDd(null);
    }
  }, [from, to]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await makeNewRide(from, to, vehicleType);
    if (res.success) {
      setMessage("Ride booked successfully");
      router.refresh();
    } else {
      setMessage("Error: " + res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff4e6] text-[#4e342e] p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="max-w-xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#bf360c] mb-4">Book a ride</h2>
        <p className="mb-4 text-[#6d4c41]">Enter your pick-up and drop-off location</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pick-up */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Enter pick-up pincode</option>
            {pincodeOptions1.map(({ location, pincode }) => (
              <option key={pincode + location} value={pincode}>
                {location} - {pincode}
              </option>
            ))}
          </select>

          {/* Drop-off */}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Enter drop-off pincode</option>
            {pincodeOptions2.map(({ location, pincode }) => (
              <option key={pincode + location} value={pincode}>
                {location} - {pincode}
              </option>
            ))}
          </select>

          {/* Distance display */}
          <h2 className="text-lg">
            Distance: {dd !== null ? dd : "—"}
          </h2>

          {/* Date & time */}
          <input
            type="datetime-local"
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Vehicle type */}
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(parseFloat(e.target.value))}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value={1}>Sedan - 4 Seater</option>
            <option value={1.5}>SUV - 7 Seater</option>
            <option value={2}>Premium - 4 Seater</option>
            <option value={2.5}>Premium - 7 Seater</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#ff9800] hover:bg-[#fb8c00] text-white font-semibold py-2 px-4 rounded"
          >
            Ride now
          </button>

          {message && (
            <p className="text-sm mt-2 text-red-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
