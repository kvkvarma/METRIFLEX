import React from 'react'

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}

export default StatCard