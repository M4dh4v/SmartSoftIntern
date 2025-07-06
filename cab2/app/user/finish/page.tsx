// app/user/booking/finished/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FinishedPage() {
  const router = useRouter();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => c - 1);
    }, 1000);

    if (counter === 0) {
      clearInterval(timer);
      router.push("/user/dashboard"); // adjust this path if your dashboard is elsewhere
    }

    return () => clearInterval(timer);
  }, [counter, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-green-600 dark:text-green-400">
          ✅ Ride Complete
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Redirecting back in{" "}
          <span className="font-mono text-xl">{counter}</span>…
        </p>
      </div>
    </div>
  );
}
