import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdHorizontalSplit } from "react-icons/md";
import { GiForkKnifeSpoon } from "react-icons/gi";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen w-20 bg-gray-300
            flex flex-col items-center py-6 space-y-6
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0`}

      >
        <div className="w-10 h-10 bg-gray-700 rounded-xl" />

        <NavLink to="/" className="flex flex-col items-center text-xs gap-1">
          <LuLayoutDashboard size={25} />
          Dashboard
        </NavLink>

        <NavLink to="/trainers" className="flex flex-col items-center text-xs gap-1">
          <FaPeopleGroup size={25} />
          Trainers
        </NavLink>

        <NavLink to="/workoutsplits" className="flex flex-col items-center text-xs gap-1">
          <MdHorizontalSplit size={25} />
          Splits
        </NavLink>

        <NavLink to="/macros" className="flex flex-col items-center text-xs gap-1">
          <GiForkKnifeSpoon size={25} />
          Macros
        </NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-[#F7F7F7]">

        {/* HAMBURGER (MOBILE ONLY)
        <div className="lg:hidden p-4">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-gray-200"
          >
            <HiMenuAlt2 size={22} />
          </button>
        </div> */}

        {/* PAGE CONTENT */}
        <main >
          <Outlet context={{setOpen}}/>
        </main>
      </div>

    </div>
  );
};

export default Sidebar;
