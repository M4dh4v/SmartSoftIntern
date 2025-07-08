// app/api/admin/route.ts
import { NextResponse } from "next/server";
import {
  getAllRiders,
  getAllUsers,
  getActiveRides,
  getFinishedRides,
  getNonValidRiders,
  acceptRider,
  deleteRider,
  deleteUser,
} from "@/app/admin/actions";

export async function POST(request: Request) {
  const { method, payload } = await request.json();
  let result;

  switch (method) {
    case "getAllRiders":
      result = await getAllRiders();
      break;
    case "getAllUsers":
      result = await getAllUsers();
      break;
    case "getActiveRides":
      result = await getActiveRides();
      break;
    case "getFinishedRides":
      result = await getFinishedRides();
      break;
    case "getNonValidRiders":
      result = await getNonValidRiders();
      break;
    case "acceptRider":
      result = await acceptRider({ id: payload.id });
      break;
    case "deleteRider":
      result = await deleteRider({ id: payload.id });
      break;
    case "deleteUser":
      result = await deleteUser({ id: payload.id });
      break;
    default:
      return NextResponse.json(
        { success: false, message: "Invalid method", data: null },
        { status: 400 }
      );
  }

  return NextResponse.json(result);
}
