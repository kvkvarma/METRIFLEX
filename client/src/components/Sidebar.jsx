import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdHorizontalSplit } from "react-icons/md";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { Dumbbell } from "lucide-react";
import { GrLogout } from "react-icons/gr";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/Dashboard", icon: LuLayoutDashboard, label: "Dashboard" },
    { to: "/trainers", icon: FaPeopleGroup, label: "Trainers" },
    { to: "/workoutsplits", icon: MdHorizontalSplit, label: "Splits" },
    { to: "/macros", icon: GiForkKnifeSpoon, label: "Macros" },
    { to: "/todaymetrics", icon: GiForkKnifeSpoon, label: "Metrics" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen w-20 bg-gradient-to-b from-gray-800 to-gray-900
            flex flex-col items-center py-6 space-y-8 shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
            <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          {/* Glow effect */}
          {/* <div className="absolute inset-0 bg-green-500 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-200" /> */}
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-gray-700" />

        {/* Navigation Items */}
        <nav className="flex flex-col items-center space-y-6 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center text-xs gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-r-full" />
                  )}

                  {/* Icon container with background */}
                  <div
                    className={`relative p-2 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-600 shadow-lg shadow-gray-600/50"
                        : "bg-gray-700/50 group-hover:bg-gray-700"
                    }`}
                  >
                    <item.icon
                      size={22}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Tooltip for hover (optional) */}
                  {/* <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl pointer-events-none"> */}
                    {/* {item.label} */}
                    {/* <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" /> */}
                  {/* </div> */}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section (optional user profile or settings) */}
        <div className="mt-auto">
          <div className="w-10 h-px bg-gray-700 mb-4" />
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            <GrLogout color="white"/>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-[#F7F7F7] min-h-screen">
        <main>
          <Outlet context={{ setOpen }} />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;