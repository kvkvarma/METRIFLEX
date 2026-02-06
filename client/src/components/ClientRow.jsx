// import React from 'react'
// const ClientRow = ({activeClients}) => {
//   // const statusColor =
//     // status === "On Track" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
//   console.log(activeClients)
//   return (
//     <>
//       {activeClients.map((item) => (
//         <div key={item.id ?? item.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
//           <div>
//             <p className="font-medium">{item.name}</p>
//             <p className="text-xs text-gray-500">{item.goal}</p>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
//               {status}
//             </span> */}
//             <button className="text-xs bg-black text-white px-3 py-1 rounded">
//               View
//             </button>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// export default ClientRow