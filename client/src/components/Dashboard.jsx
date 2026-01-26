import React, { useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoFootsteps } from "react-icons/io5";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CaloriesCard from "./CaloriesCard";
import MacrosCard from "./MacroCard";
import TodaysPlan from "./TodaysPlan";
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {

  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const { user } = useAuth();
  const [displayChart, setDisplayChart] = useState("protein");
  const { setOpen } = useOutletContext();
  useEffect(() => {
    if (!user) return;
    const fetchDailyMacros = async () => {
      try {
        const dailyMacrosResponse = await axios.get(
          "http://localhost:8080/macros/getDailyMacros",
          {
            params: { user: user.uid }
          }
        );
        const userGoalsResponse= await axios.get(
          "http://localhost:8080/macros/getMacroGoals",
          {
            params: { user: user.uid }
          }
        );
        setDailyMacrosData(dailyMacrosResponse.data.userDailyMacrosData);
        console.log(userGoalsResponse.data.macroGoals.goal)
        setTargetUserGoals(userGoalsResponse.data.macroGoals.goal);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchDailyMacros();
  }, []);
  
  console.log("targetGoals : ",targetUserGoals);
  const newMacros = dailyMacrosData.map(item => ({
      date: item.date,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
      calories: item.calories,
      steps: item.steps,
      sleep: item.sleep,
      water: item.water
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
console.log(userGoals)

const todayEntry = useMemo(() => {
  const todayDate = new Date().toISOString().split("T")[0];
  return newMacros.find(item =>
    item.date.startsWith(todayDate)
  );
}, [newMacros]);
console.log(todayEntry);
  return (
    
    <>
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
  
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

        {/* Daily Task (DESKTOP SAME AS IMAGE) */}

        <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
          <div className="col-span-2 bg-white h-28 rounded-xl p-4 flex items-center">
            <TodaysPlan userGoals={userGoals} todayEntry={todayEntry} />
          </div>

          <div className="col-span-1 bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Sleep</span>
            <span className="text-xl font-semibold">8.3 hr</span>
          </div>

          <div className="col-span-1 bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Steps</span>
            <div className="flex items-center gap-2">
              <IoFootsteps size={22} />
              <span className="text-xl font-semibold">2376</span>
            </div>
          </div>

          <div className="col-span-1 bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Food</span>
            <span className="text-xl font-semibold">1200 kcal</span>
          </div>

          <div className="col-span-1 bg-white h-28 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-sm font-medium">Heart</span>
            <div className="flex items-center gap-2">
              <FaHeart size={20} />
              <span className="text-xl font-semibold">63 bpm</span>
            </div>
          </div>

        </section>

        {/* Overview / Calories / Activity */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
             <MacrosCard 
              todayMacros={{
                carbs: todayEntry?.carbs || 0,
                fats: todayEntry?.fats || 0,
                protein: todayEntry?.protein || 0,
              }}
              macroGoals={{
                carbs: userGoals?.carbsGoal || 0,
                fats: userGoals?.fatsGoal || 0,
                protein: userGoals?.proteinGoal || 0,
              }}
            />
         <div className="lg:col-span-1">
              <CaloriesCard dailyMacrosData = {dailyMacrosData} todayEntry = {todayEntry} userGoals = {userGoals} />
         </div>
          <div className="bg-gray-200 h-64 rounded-xl p-4 lg:col-span-3">
             <select value={displayChart} name="displayChart" id="displayChart" onChange={(e) => setDisplayChart(e.target.value)} > <option value="protein">Protein</option> <option value="carbs">Carbs</option> <option value="fats">Fats</option> <option value="calories">Calories</option> </select>
        <ResponsiveContainer width="100%" height={220}>
         <AreaChart data={newMacros}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#111827" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#111827" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", { weekday: "short" })
          }
          tickLine={false}
          axisLine={false}
        />

        <YAxis hide />

        <Tooltip
          labelFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })
          }
        />

        <Area
          type="monotone"
          dataKey={displayChart}
          stroke="#111827"
          strokeWidth={2.5}
          fill="url(#colorValue)"
          dot={false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
          </div>
        </section>

        {/* Bottom Section */}
       <div className="lg:col-span-2 bg-white rounded-xl p-4">
       Trainers

</div>


      </main>
    </>
  );
};

export default Dashboard;
