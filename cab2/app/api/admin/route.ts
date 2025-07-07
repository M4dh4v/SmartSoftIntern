import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function getAllRiders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rider').select();
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Riders retrieved successfully', data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error retrieving riders', data: null };
  }
}

export async function getAllUsers() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('user').select();
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Users retrieved successfully', data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error retrieving users', data: null };
  }
}

export async function getActiveRides() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rides').select().eq('active', true);
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Active rides retrieved successfully', data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error retrieving active rides', data: null };
  }
}

export async function getFinishedRides() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rides').select().eq('finished', true);
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Finished rides retrieved successfully', data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error retrieving finished rides', data: null };
  }
}

export async function getNonValidRiders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rider').select('id').eq('valid', false);
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Non-valid riders retrieved successfully', data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error retrieving non-valid riders', data: null };
  }
}

export async function acceptRider({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('rider').update({ valid: true }).eq('id', id);
    if (error) return { success: false, message: error.message, data: null };
    return { success: true, message: 'Rider accepted successfully', data: null };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error accepting rider', data: null };
  }
}

export async function deleteRider({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: tabError } = await supabaseAdmin.from('rider').delete().eq('id', id);
    if (tabError) return { success: false, message: tabError.message, data: null };

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) return { success: false, message: authError.message, data: null };

    return { success: true, message: 'Rider deleted successfully', data: null };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error deleting rider', data: null };
  }
}

export async function deleteUser({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: tabError } = await supabaseAdmin.from('user').delete().eq('id', id);
    if (tabError) return { success: false, message: tabError.message, data: null };

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) return { success: false, message: authError.message, data: null };

    return { success: true, message: 'User deleted successfully', data: null };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown error deleting user', data: null };
  }
}

// Single REST API entrypoint
// app/api/admin/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { method, payload } = await request.json();
  let result;

  switch (method) {
    case 'getAllRiders':
      result = await getAllRiders();
      break;
    case 'getAllUsers':
      result = await getAllUsers();
      break;
    case 'getActiveRides':
      result = await getActiveRides();
      break;
    case 'getFinishedRides':
      result = await getFinishedRides();
      break;
    case 'getNonValidRiders':
      result = await getNonValidRiders();
      break;
    case 'acceptRider':
      result = await acceptRider({ id: payload.id });
      break;
    case 'deleteRider':
      result = await deleteRider({ id: payload.id });
      break;
    case 'deleteUser':
      result = await deleteUser({ id: payload.id });
      break;
    default:
      return NextResponse.json(
        { success: false, message: 'Invalid method', data: null },
        { status: 400 }
      );
  }

  return NextResponse.json(result);
}
