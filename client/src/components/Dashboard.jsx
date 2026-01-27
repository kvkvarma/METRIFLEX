import React, { useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoFootsteps } from "react-icons/io5";
import { GiNightSleep, GiRoastChicken } from "react-icons/gi";
import { useOutletContext } from "react-router-dom";
import ProgressWithLabel from "./ProgressWithLabel";
import Graph from "./Graph";
import axios from "axios";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import CaloriesCard from "./CaloriesCard";
import MacrosCard from "./MacroCard";
import TodaysPlan from "./TodaysPlan";

const Dashboard = () => {
  const { user } = useAuth();
  const { setOpen } = useOutletContext();

  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const [displayChart, setDisplayChart] = useState("protein");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const dailyMacrosResponse = await axios.get(
          "http://localhost:8080/macros/getDailyMacros",
          { params: { user: user.uid } }
        );

        const userGoalsResponse = await axios.get(
          "http://localhost:8080/macros/getMacroGoals",
          { params: { user: user.uid } }
        );

        setDailyMacrosData(dailyMacrosResponse.data.userDailyMacrosData);
        setTargetUserGoals(userGoalsResponse.data.macroGoals.goal);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, [user]);

  const newMacros = dailyMacrosData.map((item) => ({
    date: item.date,
    protein: item.protein,
    carbs: item.carbs,
    fats: item.fats,
    calories: item.calories,
    steps: item.steps,
    sleep: item.sleep,
    water: item.water,
  }));

  const userGoals = {
    waterGoal: targetUserGoals?.water ?? 0,
    sleepGoal: targetUserGoals?.sleep ?? 0,
    stepsGoal: targetUserGoals?.steps ?? 0,
    calorieGoal: targetUserGoals?.calories ?? 0,
    proteinGoal: targetUserGoals?.protein ?? 0,
    carbsGoal: targetUserGoals?.carbs ?? 0,
    fatsGoal: targetUserGoals?.fats ?? 0,
  };

  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return newMacros.find((item) => item.date.startsWith(today));
  }, [newMacros]);

  return (
    <main className="flex flex-col p-4 lg:p-6 overflow-hidden gap-6">
      <div className="space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-300 p-4 rounded-xl">
          <div className="flex items-center gap-3">
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

        {/* Daily Tasks */}
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="col-span-2 bg-white h-28 rounded-xl p-4 flex items-center">
            <TodaysPlan userGoals={userGoals} todayEntry={todayEntry} />
          </div>

          <div className="bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Sleep</span>
            <div className="flex items-center gap-2">
              <GiNightSleep size={22} color="#191970" />
              <span className="text-xl font-semibold">6.8 hr</span>
            </div>
          </div>

          <div className="bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Steps</span>
            <div className="flex items-center gap-2">
              <IoFootsteps size={22} color="brown" />
              <span className="text-xl font-semibold">2376</span>
            </div>
          </div>

          <div className="bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Food</span>
            <div className="flex items-center gap-2">
              <GiRoastChicken size={22} color="#D27D2D" />
              <span className="text-xl font-semibold">1200 Kcal</span>
            </div>
          </div>

          <div className="bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Heart</span>
            <div className="flex items-center gap-2">
              <FaHeart size={20} color="red" />
              <span className="text-xl font-semibold">63 bpm</span>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <MacrosCard
            todayMacros={{
              carbs: todayEntry?.carbs || 0,
              fats: todayEntry?.fats || 0,
              protein: todayEntry?.protein || 0,
            }}
            macroGoals={{
              carbs: userGoals.carbsGoal,
              fats: userGoals.fatsGoal,
              protein: userGoals.proteinGoal,
            }}
          />

          <CaloriesCard
            dailyMacrosData={dailyMacrosData}
            todayEntry={todayEntry}
            userGoals={userGoals}
          />
           <div className="bg-white rounded-xl p-4 lg:col-span-3">
            <Graph dailyMacrosData={dailyMacrosData}/>
          </div> 
        </section>
      </div>
      {/*================= BOTTOM CONTENT =================*/}
<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 ">
  {/* Trainers */}
  <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-gray-800">Popular trainer</h2>
      <span className="text-sm text-gray-400">Cardio</span>
    </div>

    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
      {/* Trainer Card */}
     <div className="h-48 lg:h-72 rounded-xl bg-gradient-to-b from-red-800 to-red-600 text-white p-4 flex flex-col overflow-hidden">
    <div>
      <h3 className="font-normal text-lg">Adam Smith</h3>
      <p className="my-3 text-xs opacity-80 max-h-16 lg:max-h-40 overflow-y-auto pr-1">
        MMA Expert With 10 Years of Ex perience in Training Professional Fighters. MMA Expert With 10 Years of Ex perience in Training Professional Fighters. MMA Expert With 10 Years of Ex perience in Training Professional Fighters.MMA Expert With 10 Years of Ex perience in Training Professional Fighters.MMA Expert With 10 Years of Ex perience in Training Professional Fighters.
      </p>
    </div>
  <button className="text-xs bg-white/20 rounded-lg py-2 mt-auto">
    View profile
  </button>
</div>


      <div className="h-48 lg:h-72 rounded-xl bg-gradient-to-b from-green-800 to-green-600 text-white p-4 flex flex-col justify-between">
         <div>
          <h3 className="font-normal text-lg">Adam Smith</h3>
          <p className="my-3 text-xs opacity-80 max-h-16 lg:max-h-40 overflow-y-auto pr-1">
            MMA Expert With 10 Years of Ex perience in Training Professional Fighters.
          </p>
        </div>
        <button className="text-xs bg-white/20 rounded-lg py-2">
          View profile
        </button>
      </div>

      <div className="h-48 lg:h-72 rounded-xl bg-gradient-to-b from-black to-gray-800 text-white p-4 flex flex-col justify-between">
         <div>
          <h3 className="font-normal text-lg">Adam Smith</h3>
          <p className="my-3 text-xs opacity-80 max-h-16 lg:max-h-40 overflow-y-auto pr-1">
            MMA Expert With 10 Years of Ex perience in Training Professional Fighters.
          </p>
        </div>
        <button className="text-xs bg-white/20 rounded-lg py-2">
          View profile
        </button>
      </div>
    </div>
  </div>

  {/* Workout Statistics */}
  <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-gray-800">Workout Statistics</h2>
      <span className="text-sm text-gray-400">Weekly</span>
    </div>

    <div className="flex-1 flex items-center justify-center">
      <div className="w-40 h-40 rounded-full border-[12px] border-lime-400 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">35 min</span>
        <span className="text-sm text-gray-500">350 calories</span>
      </div>
    </div>

    <div className="space-y-3 mt-6">
      <ProgressWithLabel />
      <ProgressWithLabel />
    </div>
  </div>
</div>

    </main>
  );
};

export default Dashboard;
