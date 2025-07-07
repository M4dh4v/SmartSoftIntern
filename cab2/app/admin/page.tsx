import AdminPage from "@/components/adminPage";
import { getActiveRides, getAllRiders, getAllUsers, getFinishedRides, getNonValidRiders } from "./actions";
import NavBar from "@/components/navbar";

export default async function Page(){
  let data = {
    users: await getAllUsers(),
    riders: await getAllRiders(),
    waiting : await getNonValidRiders(),
    totalRides : await getFinishedRides(),
    activeRides: await getActiveRides(),
  }
  console.log(data)

  data= JSON.parse(JSON.stringify(data))
  // console.log(data)

  return(
    <div className="min-h-screen w-full bg-[#fff4e6] text-[#4e342e] flex flex-col">
      <NavBar />
    <AdminPage data ={data} />
    </div>
  )
}