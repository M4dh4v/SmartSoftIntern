import NavBar from "@/components/navbar"
import Link from "next/link"

export default function Page() {
    return(
        <>
        <NavBar />
        <p>Admin has not accepted your account yet <br />  Contact Admin
        <Link href="/auth/login">Try checking again by clicking on THIS</Link>
        </p></>
    )
}