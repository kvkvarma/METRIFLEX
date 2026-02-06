import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import StatCard from './StatCard'
import CaloriesBarChart from './Graph';
import { ChartPieSeparatorNone } from './Piechart';
import { ChartTooltipDefault } from './ChartTooltip';
const TrainerDashboard = () => {
  const [clientRequests,setClientRequests] = useState([]);
  const [activeClients,setActiveClients] = useState([]);
  const {user} = useAuth();
  const [client,setClient] = useState(null);
  const [clientName,setClientName] = useState('Name');
  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [requestsAcceptanceRatio,setRequestsAcceptanceRatio] = useState([])
  useEffect(() => {
  const fetchRequests = async () => {
    if (!user?.uid) return;
    try {
      const response = await axios.get(
        "http://localhost:8080/trainer/gettrainerrequests",
        {
          params: { id: user.uid }
        }
      );

      console.log(response.data.requests);
      setClientRequests(response.data.requests);
      setActiveClients(response.data.activeclients);

      setRequestsAcceptanceRatio([{name:"Rejected Requests",count : response.data.rejectedRequests},
        {name:"Total Requests",count : response.data.totalReuqests},
        {name:"Active Requests",count : response.data.totalActiveClients}]);
    } catch (err) {
      console.log(
        "Error fetching client requests to trainer:",
        err.response?.data || err.message
      );
    }
  };
  fetchRequests();
}, [user]);

    const addToClient = async(id,name,goal,plan)=>{
      try{
        const response = await axios.post("http://localhost:8080/trainer/addclienttotrainer",
          {
            trainerID:user.uid,
            userId:id,
            name:name,
            goal:goal,
          }
        );
        setActiveClients(prev => [...prev,response.data.newClient])
        await removeClientRequest(id);
      }
      catch(err){
        console.log("Error Message : ",err.message);
      }
    }

    const removeClientRequest = async(id)=>{
      try{
        const response = await axios.post("http://localhost:8080/trainer/removeclientrequests",{trainerID:user.uid,id:id});
        setClientRequests(prev=>prev.filter(req => req.userId !== id));
      }
      catch(err){
        console.log("Error Message : ",err.message)
      }
    }
    const handleChange = async (id,name) => {
    setClient(id);
    setClientName(name);
    const getResponse = await axios.get(
      "http://localhost:8080/macros/getDailyMacros",
      {
        params: { user: id } 
      }
    );
    setDailyMacrosData(getResponse.data.userDailyMacrosData);
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
      caloriesburned:item.caloriesburned
    }));

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col">

    {/* ================= HEADER ================= */}
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 shrink-0">
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
    <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 overflow-auto">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-full lg:w-64 bg-white rounded-xl p-4 space-y-4 shrink-0">
        <StatCard title="Active Clients" value="18" />
        <StatCard title="Sessions / Week" value="42" />
        <StatCard title="Avg Compliance" value="87%" />
        <StatCard title="Calories Burned" value="96k" />
      </aside>

      {/* ===== CONTENT ===== */}
      <section className="flex-1 flex flex-col gap-6 overflow-hidden">

        {/* ===== TOP SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Trainer Stats */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4">
            <h2 className="font-semibold mb-2">Trainer Stats</h2>
            <div className="h-64 lg:h-80 rounded-lg bg-gray-100 flex items-center justify-center">
              Trainer Stats Chart
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl ">
            <ChartPieSeparatorNone requestsAcceptanceRatio = {requestsAcceptanceRatio}/>
          </div>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

          {/* Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 flex flex-col">
            <h2 className="font-semibold mb-4">{clientName} - Progress</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <CaloriesBarChart
                dailyMacrosData={userDailyMacros}
                // cardHeight="64"
              />
              <ChartTooltipDefault
                dailyMacrosData={userDailyMacros}
                // cardHeight="52"
              />
            </div>

            {/* <button className="mt-4 h-10 bg-gray-200 rounded-2xl">
              Send Response
            </button> */}
          </div>

          {/* Clients */}
          <div className="flex flex-col gap-6 overflow-hidden">

            {/* Active Clients */}
            <div className="bg-white rounded-xl p-4 max-h-64 lg:flex-1 overflow-y-auto">
              <h2 className="font-semibold mb-3">Active Clients</h2>
              {activeClients.map((item) => (
                <div
                  key={item.userId}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.goal}</p>
                  </div>
                  <button
                    onClick={() => handleChange(item.userId, item.name)}
                    className="text-xs bg-black text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>

            {/* Client Requests */}
            <div className="bg-white rounded-xl p-4 max-h-64 lg:flex-1 overflow-y-auto">
              <h2 className="font-semibold mb-3">Client Requests</h2>

              {clientRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No pending requests</p>
              ) : (
                clientRequests.map((item) => (
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
        </div>
      </section>
    </main>
  </div>
);


}

export default TrainerDashboard