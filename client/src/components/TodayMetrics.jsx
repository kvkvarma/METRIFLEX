import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const TodayMetrics = () => {

  const { user } = useAuth()

  const [cardioMetrics, setCardioMetrics] = useState({
    water: 0,
    steps: 0,
    bpm: 0,
    sleep: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setCardioMetrics(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addTodayMetrics = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:8080/macros/addtodaymetrics",
        { userId: user.uid, ...cardioMetrics }
      )
    } catch (err) {
      console.log("Error message :", err.message)
    }
  }

  return (
     <div className="bg-gray-50 min-h-screen flex items-center justify-center p-5" >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Fitness Details
        </h2>

        <form className="space-y-4" onSubmit={addTodayMetrics}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Steps
            </label>
            <input
              type="number"
              name = "steps"
              value = {cardioMetrics.steps}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Bpm level
            </label>
            <input
              name = "bpm"
              value = {cardioMetrics.bpm}
              onChange={handleChange}
              type="number"
              placeholder="Fat loss / Muscle gain"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter water intake
            </label>
            <input
              type="number"
              name = "water"
              value = {cardioMetrics.water}
              onChange={handleChange}
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep
            </label>
            <input
              type="number"
              name = "sleep"
              value = {cardioMetrics.sleep}
              onChange={handleChange}
              placeholder="Enter sleep hours"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>


          <button
            type="submit"
            className="w-full mt-4 rounded-xl bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default TodayMetrics
