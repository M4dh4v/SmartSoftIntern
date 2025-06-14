"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/user/login");
    }, 2000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
