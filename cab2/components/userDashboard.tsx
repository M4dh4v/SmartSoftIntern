"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { distance } from "@/distances/getDistance";
import locationsList from "@/distances/locationsList";
import { Button } from "./ui/button";

export default function UserDashboard() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicleRate, setVehicleRate] = useState(0);
  const [vehicleLabel, setVehicleLabel] = useState("");
  const [dd, setDd] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pincodeOptions = locationsList();

  const handleVehicleSelect = (rate: number, label: string) => {
    setVehicleRate(rate);
    setVehicleLabel(label);
  };

  useEffect(() => {
    if (from && to && vehicleRate) {
      distance(from, to)
        .then((d) => {
          setDd(d);
          setFare(d * vehicleRate);
        })
        .catch(() => {
          setDd(null);
          setFare(null);
        });
    } else {
      setDd(null);
      setFare(null);
    }
  }, [from, to, vehicleRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const d = await distance(from, to);
      const f = d * vehicleRate;

      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          vehicle: vehicleLabel,
          price: f,
          distance: d,
        }),
      });

      const xx = await res.json();
      if (xx.success) {
        const ride = Array.isArray(xx.data) ? xx.data[0] : xx.data;
        const id = ride.id.toString();
        setMessage("Ride booked successfully");
        router.push(`/user/waiting/${id}`);
      } else {
        setMessage("Error: " + xx.message);
        setSubmitting(false);
      }
    } catch (err) {
      setMessage("Failed to calculate distance.");
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col md:flex-row gap-6 px-6 py-10 items-start justify-between bg-[#fffaf2] text-[#4e342e] min-h-screen">
      {/* Sidebar */}
      <aside className="bg-[#ffe0b2] w-full md:w-1/4 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-[#bf360c]">Cabsy</h2>
        <ul className="space-y-3 text-base">
          <li>🏠 Dashboard</li>
          <li>📖 Ride history</li>
          <li>👤 Profile</li>
        </ul>
      </aside>

      {/* Main Content */}
      <section className="w-full md:w-3/4 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h1 className="text-2xl font-bold text-[#bf360c]">Welcome User 👋</h1>
          <p className="mt-2">Book your next ride with ease.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Book a Ride</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pickup */}
            <h3 className="text-xl text-[#bf360c] mb-2">Pickup Location</h3>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setTo("");
              }}
              required
              className="text-white w-full border rounded px-4 py-2"
            >
              <option value="">Select pickup location</option>
              {pincodeOptions.map(({ location, pincode }) => (
                <option key={pincode} value={pincode}>
                  {location} - {pincode}
                </option>
              ))}
            </select>

            {/* Drop-off */}
            <h3 className="text-xl text-[#bf360c] mt-4 mb-2">Drop-off Location</h3>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              disabled={!from}
              className={`w-full border rounded px-4 py-2 ${!from ? 'bg-gray-100 cursor-not-allowed' : 'text-white'}`}
            >
              <option value="">
                {from ? 'Select drop-off location' : 'Select pickup first'}
              </option>
              {pincodeOptions
                .filter(({ pincode }) => pincode !== from)
                .map(({ location, pincode }) => (
                  <option key={pincode} value={pincode}>
                    {location} - {pincode}
                  </option>
                ))}
            </select>

            {/* Vehicle Type */}
            <h3 className="text-xl text-[#bf360c] mb-2">Vehicle Type</h3>
            <select
              value={vehicleRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                const label = e.target.selectedOptions[0]?.text || "";
                handleVehicleSelect(rate, label);
              }}
              required
              className="text-white w-full border rounded px-4 py-2"
            >
              <option value={0}>Select vehicle type</option>
              <option value={10}>Hatchback/Sedan</option>
              <option value={14}>SUV / 7-Seater</option>
              <option value={18}>Premium Sedan</option>
              <option value={22}>Premium SUV</option>
            </select>

            {/* Distance & Fare */}
            {dd !== null && fare !== null && (
              <div className="flex justify-between text-lg font-medium">
                <span>Distance: {dd.toFixed(2)} km</span>
                <span>Fare: ₹{fare.toFixed(2)}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-[#ff9800] hover:bg-[#fb8c00] text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? "Booking..." : "Ride now"}
            </button>

            {message && <p className="text-sm mt-2 text-red-600">{message}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
