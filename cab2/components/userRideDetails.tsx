"use client";

import { useEffect, useState } from "react";
import locationsList from "@/distances/locationsList";

// Types
export type Ride = {
  id: string;
  user: string;
  from: string;
  to: string;
  distance: number | null;
  price: number | null;
  vehicleType: number;
};

export type RiderDetails = {
  id: string;
  name: string;
  phoneNumber: string;
  vehicleType: number;
  vehicleNumber: string;
  pincode: number;
  DLno: string;
};

// Props
type Props = {
  riderDetails: RiderDetails;
};

export default function UserRideDetails({ riderDetails }: Props) {
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const pincodeOptions = locationsList();

  useEffect(() => {
    fetch("/api/rides")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAllRides(json.data);
        else console.error("Error fetching rides:", json.message);
      })
      .catch((err) => console.error("Network error fetching rides:", err));
  }, []);

  const handleAcceptRide = (rideId: string) => {
    console.log("Accepted Ride ID:", rideId);
    console.log("Accepted By Rider:", riderDetails);

    alert(`Ride ${rideId} accepted by ${riderDetails.name}`);

    // Example API call:
    // fetch("/api/acceptRide", {
    //   method: "POST",
    //   body: JSON.stringify({ rideId, riderId: riderDetails.id }),
    //   headers: { "Content-Type": "application/json" },
    // });
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf6e3] text-[#4e342e]">
      <h1 className="text-3xl font-bold text-[#bf360c] mb-4">
        Hello, {riderDetails.name} 👋
      </h1>

      <h2 className="text-xl font-semibold mb-4">Available Rides</h2>

      {allRides.length === 0 ? (
        <p className="text-gray-500 italic">No available rides.</p>
      ) : (
        <ul className="space-y-3">
          {allRides.map((ride) => (
            <li
              key={ride.id}
              className="p-4 border rounded shadow-sm flex justify-between items-start bg-white"
            >
              <div>
                <div className="mb-1">
                  <strong>From:</strong> {ride.from} → <strong>To:</strong> {ride.to}
                </div>
                <div className="mb-1">
                  <strong>Distance:</strong>{" "}
                  {ride.distance != null ? `${ride.distance.toFixed(2)} km` : "N/A"}
                </div>
                <div>
                  <strong>Fare:</strong>{" "}
                  {ride.price != null ? `₹${ride.price.toFixed(2)}` : "N/A"}
                </div>
              </div>
              <button
                onClick={() => handleAcceptRide(ride.id)}
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
