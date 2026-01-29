import React from 'react'

const RequestRow = ({ name, goal, status }) => {
    const statusColor =
        status === "On Track" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">{goal}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
          {status}
        </span>
        <button className="text-xs bg-green-900 text-white px-3 py-1 rounded">
          Accept
        </button>
        <button className="text-xs bg-red-900 text-white px-3 py-1 rounded">
          Reject
        </button>
      </div>
    </div>
  );
}

export default RequestRow