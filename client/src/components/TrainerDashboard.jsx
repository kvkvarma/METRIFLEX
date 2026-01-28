import React from 'react'
import StatCard from './StatCard'
import ClientRow from './ClientRow'
const TrainerDashboard = () => {
  return (
   <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold">Trainer Dashboard</h1>
          <p className="text-xs text-gray-500">Strength Coach</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="w-9 h-9 rounded-full bg-gray-300" />
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 overflow-hidden">

        {/* ===== LEFT COLUMN (STATS) ===== */}
        <aside className="lg:w-64 w-full bg-white rounded-xl p-4 space-y-4 shrink-0">
          <StatCard title="Active Clients" value="18" />
          <StatCard title="Sessions / Week" value="42" />
          <StatCard title="Avg Compliance" value="87%" />
          <StatCard title="Calories Burned" value="96k" />
        </aside>

        {/* ===== RIGHT COLUMN (MAIN CONTENT) ===== */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">

          {/* ===== PROGRESS SECTION ===== */}
          <div className="bg-white rounded-xl p-4 h-full md:h-72 lg:h-72">
            <h2 className="font-semibold mb-3">Clients Progress (Weekly)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="h-54 bg-gray-100 rounded-lg flex items-center justify-center bg-red-200 text-gray-400">
              Chart goes here
            </div>
            <div className="h-54 bg-gray-100 rounded-lg flex items-center justify-center bg-red-200 text-gray-400">
              Chart goes here
            </div>

            </div>
          </div>

          {/* ===== CLIENTS LIST ===== */}
          <div className="bg-white rounded-xl p-4 flex-1 overflow-hidden">
            <h2 className="font-semibold mb-4">Active Clients</h2>

            <div className="space-y-3 overflow-y-auto h-full pr-2">
              <ClientRow name="Alex Johnson" goal="Fat Loss" status="On Track" />
              <ClientRow name="Maria Smith" goal="Muscle Gain" status="Needs Attention" />
              <ClientRow name="David Lee" goal="Endurance" status="On Track" />
              <ClientRow name="Riya Patel" goal="Weight Loss" status="On Track" />
              <ClientRow name="John Doe" goal="Rehab" status="Needs Attention" />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default TrainerDashboard