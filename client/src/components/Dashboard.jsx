import React, { useEffect, useMemo, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';
import { IoFootsteps } from 'react-icons/io5';
import { GiNightSleep, GiRoastChicken } from 'react-icons/gi';
import { useOutletContext } from 'react-router-dom';
import ProgressWithLabel from './ProgressWithLabel';
// import Graph from './Graph';
import CaloriesBarChart from './Graph';
import axios from 'axios';
// import TrackingCalendar from "./TrackingCalendar"
import { useAuth } from '../../context/AuthContext';
import CaloriesCard from './CaloriesCard';
import MacrosCard from './MacroCard';
import TodaysPlan from './TodaysPlan';
import ChartAreaInteractive from './Chart';
import { CalendarDemo } from './TrackingCalendar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { setOpen } = useOutletContext();
  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const [workoutSplit, setWorkoutSplit] = useState({});
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();
  const [todayPopUp, setTodayPopup] = useState(false);

  const [cardioMetrics, setCardioMetrics] = useState({
    water: 0,
    steps: 0,
    bpm: 0,
    sleep: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardioMetrics((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTodayMetrics = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/macros/addtodaymetrics', {
        userId: user.uid,
        ...cardioMetrics,
      });
    } catch (err) {
      console.log('Error message :', err.message);
    }
    setTodayPopup(false);
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const dailyMacrosResponse = await axios.get(
          'http://localhost:8080/macros/getDailyMacros',
          { params: { user: user.uid } }
        );

        const userGoalsResponse = await axios.get(
          'http://localhost:8080/macros/getMacroGoals',
          { params: { user: user.uid } }
        );

        const res = await axios.get(
          'http://localhost:8080/trainer/getTrainers'
        );

        setTrainers(res.data.trainers);

        setDailyMacrosData(dailyMacrosResponse.data.userDailyMacrosData);
        setTargetUserGoals(userGoalsResponse.data.macroGoals.goal);
        setWorkoutSplit(userGoalsResponse.data.macroGoals.workoutSplit);

        const trainersResponse = await axios.get(
          'http://localhost:8080/trainer/getTrainers'
        );
        console.log('Trainers Data:', trainersResponse.data.trainers);
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
    caloriesburned: item.caloriesburned,
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
    const today = new Date().toISOString().split('T')[0];
    return newMacros.find((item) => item.date.startsWith(today));
  }, [newMacros]);

  const trackingData = {
    '2026-02-01': { calories: 2200, goal: 2000 },
    '2026-02-02': { calories: 1500, goal: 2000 },
    '2026-02-03': { calories: 800, goal: 2000 },
    '2026-02-05': { calories: 2000, goal: 2000 },
  };

  return (
    <main className="h-screen overflow-hiddden p-4 lg:p-4 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col gap-3 overflow-y-auto lg:overflow-hidden scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-b from-gray-700 to-gray-900 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 bg-white rounded"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <div>
              <h1 className="text-base lg:text-lg font-bold text-white">
                Welcome Back, Alex! Let's crush today
              </h1>
              <p className="hidden lg:block text-xs text-gray-200">
                Here's what's happening at your gym today
              </p>
            </div>
          </div>

          {/* <div className="flex gap-2">
              <div className="w-8 h-8 bg-white rounded-full" />
            </div> */}
        </div>

        {/* Daily Tasks */}

        {todayPopUp && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[95%] max-w-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Update Daily Cardio Metrics
              </h2>

              <form
                onSubmit={addTodayMetrics}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* STEPS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Steps
                  </label>
                  <input
                    type="number"
                    name="steps"
                    value={cardioMetrics.steps}
                    onChange={handleChange}
                    placeholder="e.g. 8000"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* BPM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BPM Level
                  </label>
                  <input
                    type="number"
                    name="bpm"
                    value={cardioMetrics.bpm}
                    onChange={handleChange}
                    placeholder="e.g. 120"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* WATER */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Intake (litres)
                  </label>
                  <input
                    type="number"
                    name="water"
                    value={cardioMetrics.water}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* SLEEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sleep (hours)
                  </label>
                  <input
                    type="number"
                    name="sleep"
                    value={cardioMetrics.sleep}
                    onChange={handleChange}
                    placeholder="e.g. 7"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="col-span-full flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setTodayPopup(false)}
                    className="px-5 py-2 rounded-xl bg-gray-200 text-sm font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium
                     hover:bg-gray-800 transition"
                  >
                    Save Metrics
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 flex-shrink-0">
          <div className="col-span-2 bg-white h-20 rounded-xl p-3 flex items-center">
            <TodaysPlan
              userGoals={userGoals}
              todayEntry={todayEntry}
              setTodayPopup={setTodayPopup}
            />
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
          <div className="h-full bg-white rounded-xl p-3 lg:col-span-3">
            <CaloriesBarChart dailyMacrosData={dailyMacrosData} />
          </div>
        </section>

        {/* Bottom Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:flex-1 lg:min-h-0">
          {/* Trainers */}

          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-3 shadow-sm lg:min-h-0">
            <ChartAreaInteractive details={newMacros} />
          </div>

          {/* Workout Statistics */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col lg:min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">
                Bro Split Plan
              </h2>
              <span className="text-xs text-gray-400">6 Day Routine</span>
            </div>

            <div className="grid grid-cols-1 gap-3 overflow-auto">
              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Monday - {workoutSplit.Monday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Bench Press • Incline DB Press • Chest Fly • Pushups
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Tuesday - {workoutSplit.Tuesday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Deadlifts • Pullups • Lat Pulldown • Barbell Rows
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Wednesday - {workoutSplit.Wednesday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Overhead Press • Lateral Raises • Rear Delt Fly
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Thursday - {workoutSplit.Thursday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Barbell Curl • Tricep Dips • Skull Crushers
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Friday - {workoutSplit.Friday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Squats • Leg Press • Lunges • Hamstring Curls
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Saturday - {workoutSplit.Saturday}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Planks • Crunches • Mountain Climbers • HIIT
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col lg:min-h-0">
            <div className="flex justify-between items-center mb-3 flex-shrink-0">
              <h2 className="font-semibold text-gray-800 text-sm">
                Popular trainer
              </h2>
              <button
                onClick={() => navigate('/trainers')}
                className="text-xs text-gray-400 border-2 px-2 py-1 rounded-xl cursor-pointer hover:border-gray-600 transition-colors"
              >
                View More
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 lg:flex-1 lg:min-h-0 p-1">
              {trainers.map((item) => (
                <div
                  key={item.trainerId}
                  className="bg-white rounded-2xl shadow-md  p-6 flex flex-col justify-between border border-gray-100"
                >
                  {/* Top Section */}
                  <div>
                    <div className="flex items-center justify-between">
                      {/* Initial Circle */}
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-900 text-white font-semibold text-lg">
                        {item.name?.charAt(0)}
                      </div>

                      {/* Experience Badge */}
                      <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                        {item.experience} yrs exp
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>

                    {/* Age & Gender */}
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <p>{item.age} years</p>
                      <p>{item.gender}</p>
                    </div>

                    {/* Speciality */}
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                        {item.speciality}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3 overflow-auto">
                      {item.description}
                    </p>
                  </div>

                  {/* Button */}
                  <button className="mt-6 w-full bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition-all font-medium text-sm">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
