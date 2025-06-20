import AdminPage from "@/components/adminPage";
import { getNonValidRiders } from "./actions";

export default async function Page(){
  let data = await getNonValidRiders()
  return <AdminPage data ={data} />
}