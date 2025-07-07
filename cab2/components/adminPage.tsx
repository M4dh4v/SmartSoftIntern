"use client";

import { useState } from "react";

export default function AdminPage({ data }: { data: any }) {
  const [users, setUsers] = useState(data?.users.data || []);
  const [riders, setRiders] = useState(data?.riders.data || []);
  const [totalRides] = useState(data?.totalRides.data.length || 0);
  const [activeRides] = useState(data?.activeRides.data.length || 0);

  // Unified REST call (no longer shown, as delete buttons removed)

  return (
    <main className="flex-1 flex flex-col md:flex-row gap-6 px-6 py-10">
      {/* Sidebar */}
      <aside className="bg-[#ffe0b2] w-full md:w-1/4 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-[#bf360c]">Admin Panel</h2>
        <ul className="space-y-3 text-base">
          <li>👤 Users</li>
          <li>🚗 Riders</li>
          <li>📦 Bookings</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      {/* Main content */}
      <section className="w-full md:w-3/4 flex flex-col gap-6">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h1 className="text-2xl font-bold text-[#bf360c]">Welcome Admin 👋</h1>
          <p className="mt-2">Manage users and riders here.</p>
        </div>

        {/* Summary Box */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex justify-around">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Rides</p>
            <p className="text-3xl font-bold">{totalRides}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Active Rides</p>
            <p className="text-3xl font-bold">{activeRides}</p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Users</h2>
          {users.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {users.map((user: any) => (
                <li
                  key={user.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm">{user.phoneNumber}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No users found.</p>
          )}
        </div>

        {/* Riders List */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Riders</h2>
          {riders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {riders.map((r: any) => (
                <li
                  key={r.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm">{r.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {r.status ?? "Active"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No riders found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
