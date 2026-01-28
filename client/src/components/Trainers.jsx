import React, { useEffect, useState } from "react"
import axios from "axios"

const Trainers = () => {
  const [trainers, setTrainers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/trainer/getTrainers"
        )
        setTrainers(res.data.trainers)
      } catch (err) {
        console.error(err.message)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="px-6 pt-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Our Professional Trainers
        </h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Choose from our certified fitness professionals to guide your journey
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {trainers.map((item) => (
          <div
            key={item._id}
            className="group rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="overflow-hidden">
              <img
                src="/trainer3.jpg"
                alt="Trainer"
                className="h-52 w-full object-fill group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {item?.name}
                </h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {item?.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {item?.experience} years • <span className="text-red-500">{item?.speciality}</span>
              </p>

              <p className="text-sm h-14 overflow-auto text-gray-500 line-clamp-3">
                {item?.description}
              </p>

              <button className="mt-4 w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition">
                Assign Trainer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Trainers
