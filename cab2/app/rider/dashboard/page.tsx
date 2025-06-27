// app/rider/dashboard/page.tsx
import RiderDashboard from "@/components/riderDashboard";
import { checkValid, checkAccept, getAllActiveRides } from "../actions";

export default async function RiderDashboardPage() {
  await checkValid();
  await checkAccept();

  const result = await getAllActiveRides();
  const rides = result.success ? result.data : [];

  return <RiderDashboard rides={rides} />;
}
