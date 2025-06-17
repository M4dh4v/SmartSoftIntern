export const dynamic = "force-dynamic";
import { getSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function RiderDashboard() {
  const supabase = await getSupabaseClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      redirect('/auth/login');
    }

    const { data: riderData, error: riderError } = await supabase
      .from('rider')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!riderData || riderError) {
      redirect('/auth/login?error=Not authorized as a rider');
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Rider Dashboard</h1>
        <p>Welcome, {riderData.name || 'Rider'}!</p>
      </div>
    );
  } catch (error) {
    console.error('Error in rider dashboard:', error);
    redirect('/auth/login?error=An error occurred');
  }
}
