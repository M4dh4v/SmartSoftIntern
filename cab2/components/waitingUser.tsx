// app/user/waiting-for-cab/page.tsx
"use client";

import Image from 'next/image';
import NavBar from '@/components/navbar'; // if you have one

export default function WaitingForCabPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {/* Optional: your site header */}
      {/* <NavBar /> */}

      <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Confirmed Icon */}
        <div className="mb-6">
          <svg
            className="w-20 h-20 text-green-500 mx-auto animate-bounce-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Waiting for Ride!</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
          We&apos;re finding a driver for your ride
        </p>

        {/* Loading spinner with icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-orange-500 rounded-full animate-spin"></div>
          
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please do not close this page. Updates will appear here.
        </p>
      </div>

      {/* Optional cancel button */}
      {/* 
      <button className="mt-8 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
        Cancel Booking
      </button>
      */}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
