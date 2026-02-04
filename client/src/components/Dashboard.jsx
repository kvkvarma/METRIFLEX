import React, { useEffect, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoFootsteps } from "react-icons/io5";
import { GiNightSleep, GiRoastChicken } from "react-icons/gi";
import { useOutletContext } from "react-router-dom";
import ProgressWithLabel from "./ProgressWithLabel";
import Graph from "./Graph";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import CaloriesCard from "./CaloriesCard";
import MacrosCard from "./MacroCard";
import TodaysPlan from "./TodaysPlan";
import ChartAreaInteractive from "./Chart";

const Dashboard = () => {
  const { user } = useAuth();
  const { setOpen } = useOutletContext();

  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const [trainers, setTrainers] = useState([]);

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

        const trainersResponse = await axios.get(
          "http://localhost:8080/trainer/getTrainers"
        );
        console.log("Trainers Data:", trainersResponse.data.trainers);
        setTrainers(trainersResponse.data.trainers);
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
    caloriesburned:item.caloriesburned
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
    <main className="h-screen overflow-hiddden p-4 lg:p-4 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col gap-3 overflow-y-auto lg:overflow-hidden scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-200 p-3 rounded-xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 bg-white rounded"
                onClick={() => setOpen(true)}
              >
                ☰
              </button>

              <div>
                <h1 className="text-base lg:text-lg font-bold">
                  Welcome Back, Alex! Let's crush today
                </h1>
                <p className="hidden lg:block text-xs text-gray-600">
                  Here's what's happening at your gym today
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white rounded-full" />
            </div>
          </div>

          {/* Daily Tasks */}
          <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 flex-shrink-0">
            <div className="col-span-2 bg-white h-20 rounded-xl p-3 flex items-center">
              <TodaysPlan userGoals={userGoals} todayEntry={todayEntry} />
            </div>

            <div className="bg-white h-20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs font-medium">Sleep</span>
              <div className="flex items-center gap-2">
                <GiNightSleep size={18} color="#191970" />
                <span className="text-lg font-semibold">6.8 hr</span>
              </div>
            </div>

            <div className="bg-white h-20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs font-medium">Steps</span>
              <div className="flex items-center gap-2">
                <IoFootsteps size={18} color="brown" />
                <span className="text-lg font-semibold">2376</span>
              </div>
            </div>

            <div className="bg-white h-20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs font-medium">Food</span>
              <div className="flex items-center gap-2">
                <GiRoastChicken size={18} color="#D27D2D" />
                <span className="text-lg font-semibold">1200 Kcal</span>
              </div>
            </div>

            <div className="bg-white h-20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-xs font-medium">Heart</span>
              <div className="flex items-center gap-2">
                <FaHeart size={16} color="red" />
                <span className="text-lg font-semibold">63 bpm</span>
              </div>
            </div>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 flex-shrink-0">
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
            <div className="bg-white rounded-xl p-3 lg:col-span-3">
              <Graph dailyMacrosData={dailyMacrosData} />
            </div>
          </section>

          {/* Bottom Content */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:flex-1 lg:min-h-0">
            {/* Trainers */}
            
            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-3 shadow-sm lg:min-h-0">
              <ChartAreaInteractive details = {newMacros} />
            </div>

            {/* Workout Statistics */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col lg:min-h-0">
              <div className="flex justify-between items-center mb-3 flex-shrink-0">
                <h2 className="font-semibold text-gray-800 text-sm">Workout Statistics</h2>
                <span className="text-xs text-gray-400">Weekly</span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[120px]">
                <div className="w-32 h-32 rounded-full border-[10px] border-lime-400 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">35 min</span>
                  <span className="text-xs text-gray-500">350 calories</span>
                </div>
              </div>

              <div className="space-y-2 flex-shrink-0">
                <ProgressWithLabel />
                <ProgressWithLabel />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col lg:min-h-0">
              <div className="flex justify-between items-center mb-3 flex-shrink-0">
                <h2 className="font-semibold text-gray-800 text-sm">Popular trainer</h2>
                <button className="text-xs text-gray-400 border-2 px-2 py-1 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                  View More
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 lg:flex-1 lg:min-h-0 lg:overflow-auto">
                {/* Trainer Card 1 */}
                <div className="h-full min-h-[180px] rounded-xl bg-gradient-to-b from-red-800 to-red-600 text-white p-3 flex flex-col">
                  <div className="flex-1 min-h-0">
                    <h3 className="font-normal text-base mb-2">Adam Smith</h3>
                    <div className="overflow-y-auto max-h-[100px] pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <p className="text-xs opacity-80 leading-relaxed">
                        MMA Expert With 10 Years of Experience in Training Professional Fighters.
                      </p>
                    </div>
                  </div>
                  <button className="text-xs bg-white/20 rounded-lg py-1.5 mt-2 hover:bg-white/30 transition-colors flex-shrink-0">
                    View profile
                  </button>
                </div>

                {/* Trainer Card 2 */}
                <div className="h-full min-h-[180px] rounded-xl bg-gradient-to-b from-green-800 to-green-600 text-white p-3 flex flex-col">
                  <div className="flex-1 min-h-0">
                    <h3 className="font-normal text-base mb-2">Sarah Johnson</h3>
                    <div className="overflow-y-auto max-h-[100px] pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <p className="text-xs opacity-80 leading-relaxed">
                        Yoga and Flexibility Expert. Certified instructor with holistic approach.
                      </p>
                    </div>
                  </div>
                  <button className="text-xs bg-white/20 rounded-lg py-1.5 mt-2 hover:bg-white/30 transition-colors flex-shrink-0">
                    View profile
                  </button>
                </div>
              </div>
            </div>

          </section>
        </div>
    </main>
  );
};

export default Dashboard;