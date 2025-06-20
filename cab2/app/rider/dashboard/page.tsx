// "use client";
import {checkValid, checkAccept} from "../actions";


export default async function RiderDashboard() {
  await checkValid()
  await checkAccept()
  return<RiderDashboard />;

}