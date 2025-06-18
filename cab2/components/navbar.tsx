import Link from "next/link";
import { DeployButton } from "./deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";



export default function NavBar(){
    return(
        <>
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <h1>Cabsify</h1>
            </div>
          <ThemeSwitcher />

        <AuthButton />          </div>
        </nav>
       
    </>
    )
}