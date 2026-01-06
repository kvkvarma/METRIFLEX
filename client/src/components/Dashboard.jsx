import React, { useState } from "react";
import { NavLink } from "react-router-dom";
const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
  className={`
    fixed lg:static z-50 top-0 left-0 h-full w-20
    bg-purple-300 flex flex-col items-center py-6 space-y-6
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
  `}
>
  <div className="w-10 h-10 bg-purple-700 rounded-xl" />

  <NavLink
    to="/"
    className="flex flex-col items-center text-xs gap-1"
  >
    <div className="w-6 h-6 bg-white rounded" />
    Dashboard
  </NavLink>

  <NavLink
    to="/trainers"
    className="flex flex-col items-center text-xs gap-1"
  >
    <div className="w-6 h-6 bg-white rounded" />
    Trainers
  </NavLink>

  <NavLink
    to="/workout-splits"
    className="flex flex-col items-center text-xs gap-1"
  >
    <div className="w-6 h-6 bg-white rounded" />
    Splits
  </NavLink>

  <NavLink
    to="/macros"
    className="flex flex-col items-center text-xs gap-1"
  >
    <div className="w-6 h-6 bg-white rounded" />
    Macros
  </NavLink>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center bg-yellow-200 p-4 rounded-xl">

          <div className="flex items-center gap-3">
            {/* Hamburger ONLY for mobile */}
            <button
              className="lg:hidden p-2 bg-white rounded"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <div>
              <h1 className="text-lg lg:text-xl font-bold">
                Welcome Back, Alex! Let’s crush today
              </h1>
              <p className="hidden lg:block text-sm text-gray-600">
                Here’s what’s happening at your gym today
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-9 h-9 bg-white rounded-full" />
            <div className="w-9 h-9 bg-white rounded-full" />
            <div className="w-9 h-9 bg-white rounded-full hidden sm:block" />
          </div>
        </div>

        {/* Daily Task (DESKTOP SAME AS IMAGE) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-red-300 h-28 rounded-xl p-4">Today's Plan</div>
          <div className="bg-blue-300 h-28 rounded-xl p-4">Sleep</div>
          <div className="bg-green-300 h-28 rounded-xl p-4">Steps</div>
          <div className="bg-orange-300 h-28 rounded-xl p-4">Food</div>
          <div className="bg-pink-300 h-28 rounded-xl p-4">Heart</div>
        </section>

        {/* Overview / Calories / Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-indigo-300 h-64 rounded-xl p-4">Overview</div>
          <div className="bg-teal-300 h-64 rounded-xl p-4">Calories</div>
          <div className="bg-lime-300 h-64 rounded-xl p-4">Fitness Activity</div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-rose-300 h-72 rounded-xl p-4">
            Popular Trainers
          </div>
          <div className="bg-cyan-300 h-72 rounded-xl p-4">
            Workout Statistics
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
