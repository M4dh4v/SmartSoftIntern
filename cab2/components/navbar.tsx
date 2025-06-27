import Image from "next/image";
import { ThemeSwitcher } from "./theme-switcher";
import { LogoutButton } from "./logout-button"; // Import your LogoutButton component

export default function NavBar() {
  return (
    <nav className="w-full bg-[#fff8f0] shadow-md border-b border-orange-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logow.png"
            alt="Cabsy Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          <h1 className="text-xl font-bold text-[#bf360c] tracking-wide">
            Cabsy
          </h1>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {/* Use your imported LogoutButton component here */}
          <LogoutButton />
          {/* <AuthButton /> // Uncomment if you're using Auth */}
        </div>
      </div>
    </nav>
  );
}