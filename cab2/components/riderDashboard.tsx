// components/riderDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import locationsList from "@/distances/locationsList";

export type Ride = {
  id: string;
  user: string;
  from: string;
  to: string;
  distance: number | null;
  price: number | null;
  vehicleType: number;
};

export default function RiderDashboard() {
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [savedPincodes, setSavedPincodes] = useState<string[]>([]);
  const pincodeOptions = locationsList();

  // 1) fetch all rides once on mount
  useEffect(() => {
    fetch("/api/rides")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAllRides(json.data);
        else console.error("Error fetching rides:", json.message);
      })
      .catch((err) => console.error("Network error fetching rides:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPincodes(
      Array.from(e.target.selectedOptions).map((o) => o.value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedPincodes(selectedPincodes);
  };

  const handleReset = () => {
    setSelectedPincodes([]);
    setSavedPincodes([]);
  };

  // 2) filter in-browser
  const available = allRides.filter((ride) =>
    savedPincodes.length > 0
      ? savedPincodes.includes(ride.from) || savedPincodes.includes(ride.to)
      : true
  );

  return (
    <div className="min-h-screen w-full bg-[#fff4e6] text-[#4e342e] flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col md:flex-row gap-6 px-6 py-10">
        {/* Sidebar + Preferences */}
        <aside className="bg-[#ffe0b2] w-full md:w-1/4 p-6 rounded-2xl shadow-md flex flex-col">
        
          <h2 className="text-xl font-semibold mb-4 text-[#bf360c]">
            Rider Panel
          </h2>
        <ul className="space-y-3 text-base">
          <li>🏠 Dashboard</li>
          <li>📖 Ride Preferences</li>
          <li>👤 Profile</li>
        </ul>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
            <label className="font-semibold">Select Available Pincodes</label>
            <select
              multiple
              size={6}
              value={selectedPincodes}
              onChange={handleChange}
              className="text-white border border-gray-300 rounded-md p-2"
            >
              {pincodeOptions.map(({ location, pincode }) => (
                <option key={pincode} value={pincode}>
                  {location} – {pincode}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-[#bf360c] text-white py-2 rounded-md hover:bg-[#a33109]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-300 text-[#4e342e] py-2 rounded-md hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
          </form>

          {savedPincodes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Your Preferences:</h4>
              <ul className="list-disc list-inside text-sm">
                {savedPincodes.map((p) => {
                  const found = pincodeOptions.find((o) => o.pincode === p);
                  return (
                    <li key={p}>
                      {found?.location} – {p}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-3/4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#bf360c]">
              Welcome back, Rider 👋
            </h1>
            <p className="mt-2 text-sm">
              Manage your availability and view nearby ride requests.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#bf360c] mb-4">
              Available Bookings
            </h2>

            {available.length === 0 ? (
              <p className="text-gray-500 italic text-sm">
                No bookings matching your pincodes.
              </p>
            ) : (
              <ul className="space-y-3">
                {available.map((ride) => (
                  <li
                    key={ride.id}
                    className="p-4 border rounded hover:shadow-sm"
                  >
                    <div className="mb-1">
                      <strong>From:</strong> {ride.from} → <strong>To:</strong>{" "}
                      {ride.to}
                    </div>
                    <div className="mb-1">
                      <strong>Distance:</strong>{" "}
                      {ride.distance != null
                        ? `${ride.distance.toFixed(2)} km`
                        : "N/A"}
                    </div>
                    <div>
                      <strong>Fare:</strong>{" "}
                      {ride.price != null
                        ? `₹${ride.price.toFixed(2)}`
                        : "N/A"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
