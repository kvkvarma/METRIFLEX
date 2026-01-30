import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import StatCard from './StatCard'
import ClientRow from './ClientRow'


const TrainerDashboard = () => {
  const [clientRequests,setClientRequests] = useState([]);
  const {user} = useAuth();

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
          <div className="bg-white rounded-xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-hidden">
            <div className="space-y-2 overflow-y-auto h-full pr-2">
              <h2 className="font-semibold mb-4">Active Clients</h2>
              <ClientRow name="Alex Johnson" goal="Fat Loss" status="On Track" />
              <ClientRow name="Maria Smith" goal="Muscle Gain" status="Needs Attention" />
              <ClientRow name="David Lee" goal="Endurance" status="On Track" />
              <ClientRow name="Riya Patel" goal="Weight Loss" status="On Track" />
              <ClientRow name="John Doe" goal="Rehab" status="Needs Attention" />
            </div>

            <div className="space-y-2 overflow-y-auto h-full pr-2">
              <h2 className="font-semibold mb-4">Client Requests</h2>
              {clientRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No pending requests</p>
              ) : (
                clientRequests.map((item) => (
                  <div key={item.userId} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.goal}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick = {()=>addToClient(item.userId,item.name,item.goal,item.plan)} className="text-xs bg-green-900 text-white px-3 py-1 rounded">
                      Accept
                    </button>
                    <button onClick = {()=>removeClientRequest(item.userId)} className="text-xs bg-red-900 text-white px-3 py-1 rounded">
                      Reject
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default TrainerDashboard