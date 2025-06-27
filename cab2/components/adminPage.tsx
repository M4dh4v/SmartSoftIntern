"use client";

import { useState } from "react";
import { acceptRider } from "@/app/admin/actions";

export default function AdminPage({ data }: { data: any }) {
  const [users,setUsers] = useState(data?.users || [])
  const [riders, setRiders] = useState(data?.riders || [])


  const makeValid = async () => {

  }
  return (

      <main className="flex-1 flex flex-col md:flex-row gap-6 px-6 py-10 items-start justify-between">
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
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#bf360c]">Welcome Admin 👋</h1>
            <p className="mt-2">Manage users and riders here.</p>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#bf360c] mb-4">Users</h2>
            {users.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {users.map((user: any) => (
                  <li key={user.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm">{user.phoneNumber}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">{user.role}</span>
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
                {riders.map((rider: any) => (
                  <li key={rider.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{rider.name}</p>
                      <p className="text-sm">{rider.email}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      {rider.status ?? "Active"}
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