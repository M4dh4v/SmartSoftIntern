"use client"


import NavBar from "@/components/navbar";
export default function UserDashboard() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <NavBar/>
     <p>Hi user</p>
    </div>
  );
}
