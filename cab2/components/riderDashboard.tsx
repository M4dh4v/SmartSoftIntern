"use client";

import { useState } from "react";
import NavBar from "@/components/navbar";
import locationsList from "@/distances/locationsList";

const pincodeOptions = locationsList()

export default function RiderDashboard() {
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [savedPincodes, setSavedPincodes] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedPincodes(options.map((o) => o.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedPincodes(selectedPincodes);
    const res = await fetch("/api/rider/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedPincodes }),
    });
    const data = await res.json();
    if (data.success) alert("Preferences saved!");
    else alert("Error: " + data.error);
  };

  const handleReset = () => {
    setSelectedPincodes([]);
    setSavedPincodes([]);
  };

  return (
    <div className="min-h-screen w-full bg-[#fff4e6] text-[#4e342e] flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col md:flex-row gap-6 px-6 py-10 items-start justify-between">
        <aside className="bg-[#ffe0b2] w-full md:w-1/4 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#bf360c]">Rider Panel</h2>
          <ul className="space-y-3 text-base">
            <li>🏠 Dashboard</li>
            <li>📍 My Routes</li>
            <li>📦 Bookings</li>
            <li>⚙️ Settings</li>
          </ul>
        </aside>

        <section className="w-full md:w-3/4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#bf360c]">Welcome back, Rider 👋</h1>
            <p className="mt-2">Manage your availability and view nearby ride requests.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Select Available Pincodes</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-start">
              <select
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
                multiple
                size={8}
                value={selectedPincodes}
                onChange={handleChange}
              >
                {pincodeOptions.map(({ location, pincode }) => (
                  <option key={pincode + location} value={pincode}>
                    {location} - {pincode}
                  </option>
                ))}
              </select>
              <div className="flex flex-col gap-2 md:ml-4">
                <button type="submit" className="bg-[#bf360c] text-white py-2 px-4 rounded-md hover:bg-[#a33109]">
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-300 text-[#4e342e] py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Reset Preferences
                </button>
              </div>
            </form>
            {savedPincodes.length > 0 && (
              <div className="mt-4 text-sm">
                <strong className="text-[#bf360c]">Your Preferences:</strong>
                <ul className="list-disc list-inside">
                  {savedPincodes.map((p) => {
                    const found = pincodeOptions.find((opt) => opt.pincode === p);
                    return <li key={p}>{found?.location} - {p}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Available Bookings</h2>
            <p className="text-sm text-[#4e342e]">Only bookings matching your selected pincodes will be displayed here.</p>
            <div className="mt-4 text-gray-500 italic text-sm">No bookings yet.</div>
          </div>
        </section>
      </main>
    </div>
  );
}