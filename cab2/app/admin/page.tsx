import AdminPage from "@/components/adminPage";
import { getAllRiders, getAllUsers, getNonValidRiders } from "./actions";
import NavBar from "@/components/navbar";

export default async function Page(){
  let data = {
    users: await getAllUsers(),
    riders: await getAllRiders()
  }
  data= JSON.parse(JSON.stringify(data))

  return(
    <div className="min-h-screen w-full bg-[#fff4e6] text-[#4e342e] flex flex-col">
      <NavBar />
    <AdminPage data ={data} />
    </div>
  )
}