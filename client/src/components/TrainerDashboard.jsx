import React, { useEffect, useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import StatCard from './StatCard'
import CaloriesBarChart from './Graph';
import { ChartPieSeparatorNone } from './Piechart';
import { ChartTooltipDefault } from './ChartTooltip';
import { BiEdit } from "react-icons/bi";
import { LuMessageSquareText } from "react-icons/lu";
import MacroProgress from './MacroProgress';
import ChartRadialLabel from './ChartLabel';
import { useMemo } from 'react';
import { CosIcon } from '@hugeicons/core-free-icons/index';

const TrainerDashboard = () => {

  const [clientRequests, setClientRequests] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [clientName, setClientName] = useState('Name');
  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [requestsAcceptanceRatio, setRequestsAcceptanceRatio] = useState([]);
  const [goalsPopUp, setGoalsPopUp] = useState(false);
  const [userPreviousGoals, setUserPreviousGoals] = useState(null);
  const [sendMessagePopup,setSendMessagePopup] = useState(false);
  const [targetUserGoals, setTargetUserGoals] = useState({});

  const [newGoals, setNewGoals] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    caloriesBurned: "",
    steps: "",
    foods: ""
  });

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      try {
        const response = await axios.get(
          "http://localhost:8080/trainer/gettrainerrequests",
          { params: { id: user.uid } }
        );
        setClientRequests(response.data.requests);
        setActiveClients(response.data.activeclients);

        setRequestsAcceptanceRatio([
          { name: "Rejected Requests", count: response.data.rejectedRequests },
          { name: "Total Requests", count: response.data.totalReuqests },
          { name: "Active Requests", count: response.data.totalActiveClients }
        ]);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchRequests();
  }, [user]);


  const handleChange = async (id, name) => {
    setClient(id);
    setClientName(name);
    try {
      const res = await axios.get(
        "http://localhost:8080/macros/getDailyMacros",
        { params: { user: id } }
      );
      setDailyMacrosData(res.data.userDailyMacrosData);
      const userGoals = await axios.get("http://localhost:8080/macros/getMAcroGoals",{
        params : {user:id}
      })
      setTargetUserGoals(userGoals.data.macroGoals.goal);
    } catch (err) {
      console.log(err.message);
    }
  };
  
  const userDailyMacros = dailyMacrosData.map((item) => ({
    date: item.date,
    protein: item.protein,
    carbs: item.carbs,
    fats: item.fats,
    calories: item.calories,
    steps: item.steps,
    sleep: item.sleep,
    water: item.water,
    caloriesburned: item.caloriesburned
  }));

  console.log("User daily macxros : ",userDailyMacros);

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
  if (!userDailyMacros.length) return null;
  return [...userDailyMacros]
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}, [userDailyMacros]);


console.log("todayEntry",todayEntry)
  useEffect(() => {
  if (activeClients.length > 0 && !client) {
    handleChange(activeClients[0].userId, activeClients[0].name);
  }
  },[activeClients,client]);


  const updateGoals = (e) => {
  const { name, value } = e.target;
  setNewGoals(prev => ({
    ...prev,
    [name]: value
  }));
};

  const editUserGoals = async (id) => {
    setClient(id);
    setGoalsPopUp(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/macros/getMAcroGoals",
        { params: { user: id } }
      );
      setUserPreviousGoals(res.data.macroGoals.goal);
    } catch (err) {
      console.log(err.message);
    }
  };
  const updateUserGoals = async()=>{
    try{
      const updatedGoals = await axios.post("http://localhost:8080/macros/updateUserGoals",{userId:client,updatedGoalValues:newGoals});
    }
    catch(err){
      console.log(err.message)
    }
    setGoalsPopUp(false);
  }

  const sendMessageToUser = async(id,name)=>{
    setSendMessagePopup(true);
    try{
      const sendMessage = await axios.post("http://localhost:8080/macros/sendMessage",{})
    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 overflow-y-auto lg:overflow-hidden">

      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white shadow-sm flex items-center px-4 shrink-0">
        <div>
          <h1 className="text-lg font-semibold">Trainer Dashboard</h1>
          <p className="text-xs text-gray-500">Strength Coach</p>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 p-4 overflow-y-auto lg:overflow-hidden">

        {/* ================= SIDEBAR ================= */}
        <aside className="bg-white rounded-xl p-4 flex flex-col gap-2 overflow-y-auto">
          <StatCard title="Trainer Stats" value="" />
          <StatCard title="Active Clients" value={activeClients.length} />
          <StatCard title="Requests" value={clientRequests.length} />
        </aside>

        {/* ================= MAIN ================= */}
        <section className="grid grid-rows-[auto_auto_1fr] gap-4 overflow-y-auto lg:overflow-hidden">

          {/* ===== TOP ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="bg-white rounded-xl p-4">
              <h2 className="font-semibold mb-2">Trainer Stats</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                Trainer Stats Chart
              </div>
            </div>

            <div className="bg-white rounded-xl flex items-center justify-center">
              <ChartPieSeparatorNone
                requestsAcceptanceRatio={requestsAcceptanceRatio}
              />
            </div>
            {goalsPopUp && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg shadow-lg">

      <h2 className="text-xl font-semibold mb-5 text-center">
        Set Daily Fitness Goals
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="number"
          name="calories"
          value={newGoals.calories}
          onChange={updateGoals}
          placeholder="Calories Intake"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="caloriesBurned"
          value={newGoals.caloriesBurned}
          onChange={updateGoals}
          placeholder="Calories to Burn"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="protein"
          value={newGoals.protein}
          onChange={updateGoals}
          placeholder="Protein (g)"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="fats"
          value={newGoals.fats}
          onChange={updateGoals}
          placeholder="Fats (g)"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="carbs"
          value={newGoals.carbs}
          onChange={updateGoals}
          placeholder="Carbs (g)"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="steps"
          value={newGoals.steps}
          onChange={updateGoals}
          placeholder="Steps"
          className="border p-2 rounded"
        />
      </div>

      <textarea
        name="foods"
        value={newGoals.foods}
        onChange={updateGoals}
        placeholder="Foods to take (eg: Chicken, Eggs, Oats...)"
        className="border p-2 rounded w-full mt-4"
        rows={3}
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setGoalsPopUp(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={updateUserGoals}
          className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
        >
          Save Goals
        </button>
      </div>

    </div>
  </div>
)}


{sendMessagePopup && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg shadow-lg">

      <h2 className="text-xl font-semibold mb-5 text-center">
        Send Report to Client
      </h2>

      <textarea
        name="foods"
        value={newGoals.foods}
        onChange={updateGoals}
        placeholder="Type message here..."
        className="border p-2 rounded w-full mt-4"
        rows={3}
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setSendMessagePopup(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
        >
          Send Message
        </button>
      </div>
    </div>
  </div>
)}

            <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[400px]">
  
  {/* ===== ACTIVE CLIENTS ===== */}
  <h2 className="font-semibold mb-3">Active Clients</h2>

  {activeClients.length === 0 ? (
    <p className="text-sm text-gray-500 mb-4">No active clients</p>
  ) : (
    activeClients.map(item => (
      <div
        key={item.userId}
        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
      >
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-gray-500">{item.goal}</p>
        </div>

        <div className="flex gap-2 items-center">
          <LuMessageSquareText className='cursor-pointer' size={18} onClick={()=>sendMessageToUser(item.userId,item.name)}/>
          <BiEdit
            size={18}
            className="cursor-pointer"
            onClick={() => editUserGoals(item.userId)}
          />
          <button
            onClick={() => handleChange(item.userId, item.name)}
            className="text-xs bg-black text-white px-3 py-1 rounded"
          >
            View
          </button>
        </div>
      </div>
    ))
  )}

  {/* ===== DIVIDER ===== */}
  <hr className="my-4" />

  {/* ===== REQUESTS ===== */}
  <h2 className="font-semibold mb-3">Requests</h2>

  {clientRequests.length === 0 ? (
    <p className="text-sm text-gray-500 text-center">No pending requests</p>
  ) : (
    clientRequests.map(item => (
      <div
        key={item.userId}
        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
      >
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-gray-500">{item.goal}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              addToClient(item.userId, item.name, item.goal, item.plan)
            }
            className="text-xs bg-green-700 text-white px-2 py-1 rounded"
          >
            Accept
          </button>

          <button
            onClick={() => removeClientRequest(item.userId)}
            className="text-xs bg-red-700 text-white px-2 py-1 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    ))
  )}

</div>


          </div>
          <h4 className='text-center font-semibold'>Client - {clientName} Progress</h4>

          {/* ===== BOTTOM ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto">

            <div className="bg-white h-80 lg:h-full rounded-xl p-4 overflow-y-auto">
              <CaloriesBarChart
                dailyMacrosData={userDailyMacros}
                cardHeight="full"
              />
            </div>

            <div className="bg-white rounded-xl p-4 overflow-y-auto h-full">
              <ChartTooltipDefault dailyMacrosData={userDailyMacros} />
            </div>

            <div className= " bg-white rounded-xl p-5 overflow-auto">
              <ChartRadialLabel todayEntry = {todayEntry} userGoals = {userGoals} className = "w-full h-full"/>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerDashboard;
