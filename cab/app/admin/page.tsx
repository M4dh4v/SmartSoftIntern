// import { getAllRiders, getAllUsers } from "./actions"

// export default async function Page() {
//     const users=await getAllUsers()
//     const riders = await getAllRiders()
//     console.log("users",users)
//     console.log("riders", riders)

//    return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black-800">
//       <div className="w-full max-w-6xl bg-gray-800 rounded shadow p-6 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300">
//         {/* User List */}
//         <div className="w-full md:w-1/2 pr-0 md:pr-6 space-y-4">
//           <h2 className="text-lg font-semibold text-gray-100">Users</h2>
//           <div className="space-y-3">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
//               >
//                 <div>
//                   <p className="text-sm font-medium text-gray-100">{user.name}</p>
//                   <p className="text-sm text-white">{user.email}</p>
//                 </div>
//                 <span className="inline-block rounded-full bg-blue-100 text-blue-100 text-xs px-3 py-1 font-medium">
//                   {user.role}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Rider List */}
//         <div className="w-full md:w-1/2 pl-0 md:pl-6 space-y-4">
//           <h2 className="text-lg font-semibold text-gray-100">Riders</h2>
//           <div className="space-y-3">
//             {riders.map((rider) => (
//               <div
//                 key={rider.id}
//                 className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
//               >
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{rider.name}</p>
//                   <p className="text-sm text-gray-100">{rider.email}</p>
//                 </div>
//                 <span className="inline-block rounded-full bg-green-100 text-green-800 text-xs px-3 py-1 font-medium">
//                   {rider.status ?? "Active"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
