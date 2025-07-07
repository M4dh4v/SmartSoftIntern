"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import logo from "@/public/logow.png";

export default function WaitingForCabPage({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let intervalId: number | undefined;

    intervalId = window.setInterval(async () => {
      const { data: rides, error } = await supabase
        .from("rides")
        .select("id, active")
        .eq("id", bookingId)
        .limit(1);

      if (!error && rides && rides.length > 0 && rides[0].active === true) {
        if (intervalId !== undefined) clearInterval(intervalId);
        router.push(`/user/booking/${rides[0].id}`);
      }
    }, 1000);

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [bookingId, router, supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff4e6] text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-orange-100">
        {/* Logo & branding */}
        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#bf360c]">
          Waiting for Your Ride!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6">
          We’re finding the best driver for you
        </p>

        {/* Spinner */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-t-4 border-[#ff7043] border-t-[#bf360c] rounded-full animate-spin-pulse"></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please keep this page open. We’ll update you shortly.
        </p>
      </div>

      <style jsx>{`
        @keyframes spin-pulse {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(1.05);
            opacity: 0.85;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
        .animate-spin-pulse {
          animation: spin-pulse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
  