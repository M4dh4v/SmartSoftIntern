"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/logow.png";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const role = data.user?.user_metadata.role;
      if (role === "admin") router.push("/admin");
      else if (role === "user") router.push("/user/dashboard");
      else if (role === "rider") router.push("/rider/dashboard");
      else router.push("/corrupt-account");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full bg-[#fff4e6] max-w-6xl flex shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Panel with Logo and Features */}
        <div className="w-1/2 bg-[#fff4e6] px-12 py-16 flex flex-col justify-center gap-8">
          <Image
            src={logo}
            alt="logo"
            width={1500}
            height={1500}
            className="mb-4 drop-shadow-xl"
          />
          <h1 className="text-3xl font-bold text-[#bf360c]">
            Pin 2 Pin Cab Booking
          </h1>
          <ul className="text-[#4e342e] text-base leading-relaxed">
            <li>🚕 Affordable rides across your city</li>
            <li>📍 Instant location tracking by pincode</li>
            <li>🕒 24x7 Reliable service</li>
            <li>💳 Cashless & safe payments</li>
          </ul>
        </div>

        {/* Right Panel Login Form */}
        <div className="w-1/2 bg-zinc-900 text-white p-10 flex items-center justify-center">
          <Card className="bg-zinc-900 text-white border-none w-full rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Login
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm underline-offset-4 hover:underline text-zinc-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {/* Signup links */}
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    href="http://localhost:3000/auth/sign-up-user"
                    className="w-full text-center py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    Sign up as User
                  </Link>
                  <Link
                    href="http://localhost:3000/auth/sign-up-rider"
                    className="w-full text-center py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium"
                  >
                    Sign up as Rider
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}