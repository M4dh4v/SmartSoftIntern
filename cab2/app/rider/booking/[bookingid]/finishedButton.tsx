"use client";
import { useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface FinishProps { rideId: number | string; }
export function FinishRideButton({ rideId }: FinishProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleFinish = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("rides")
      .update({ finished: true })
      .eq("id", rideId);

    if (error) {
      console.error("Failed to finish ride:", error);
    } else {
      router.push("/rider/finish");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleFinish}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
    >
      {loading ? "Finishing..." : "Mark as Finished"}
    </button>
  );
}
