// // actions.ts
// import { createClient } from "@/lib/supabase/server";
// export const getAllUsers = async () => {
//  const supabase = await createClient()
   
//   const { data, error } = await supabase.from('users').select('*');
//   if (error) {
//     console.error('Error fetching users:', error.message);
//     throw error;
//   }

//   return data;
// };

// export const getAllRiders = async () => {
//  const supabase = await createClient()

//     const {data,error} = await supabase.from('riders').select("*")
//     if (error) {
//     console.error('Error fetching riders:', error.message);
//     throw error;
//   }

//   return data;
// }

