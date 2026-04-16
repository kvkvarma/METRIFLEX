import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import StatCard from './StatCard';
import CaloriesBarChart from './Graph';
import { ChartPieSeparatorNone } from './Piechart';
import { ChartTooltipDefault } from './ChartTooltip';
import { BiEdit } from 'react-icons/bi';
import { LuMessageSquareText } from 'react-icons/lu';
import ChartRadialLabel from './ChartLabel';
import { useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import { set } from 'date-fns';
import LoadingAnimation from './LoadingAnimation';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
const renderContent = (data, component) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <span className="text-3xl mb-2"></span>
        <p className="text-sm">No Active Clients to see Data</p>
      </div>
    );
  }
  return component;
};
const TrainerDashboard = () => {
  const [clientRequests, setClientRequests] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [clientName, setClientName] = useState('Name');
  const [dailyMacrosData, setDailyMacrosData] = useState([]);
  const [requestsAcceptanceRatio, setRequestsAcceptanceRatio] = useState([]);
  const [goalsPopUp, setGoalsPopUp] = useState(false);
  const [sendMessagePopup, setSendMessagePopup] = useState(false);
  const [workoutSplitPopup, setWorkoutSplitPopup] = useState(false);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const [messageToSend, setMessageToSend] = useState('');
  const [detailesFetched, setDetailsFetched] = useState(false);
  const [clientMessages, setClientMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [trainerDetails, setTrainerDetails] = useState({
    name: '',
    experience: 0,
    speciality: '',
    description: '',
    status: '',
    age: 0,
    gender: '',
    contact: '',
  });

  const [newGoals, setNewGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    caloriesBurned: '',
    steps: '',
    foods: '',
  });

  const [splitGoals, setSplitGoals] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
  });

  // const API = 'http://localhost:8080';
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    async function fetchRequests() {
      if (!user?.uid) return;
      try {
        const response = await axios.get(`${API}/trainer/gettrainerrequests`, {
          params: { id: user.uid },
        });
        setClientRequests(response.data.requests);
        setActiveClients(response.data.activeclients);
        setDetailsFetched(response.data.detailsFetched);
        setRequestsAcceptanceRatio([
          { name: 'Rejected Requests', count: response.data.rejectedRequests },
          { name: 'Total Requests', count: response.data.totalReuqests },
          { name: 'Active Requests', count: response.data.totalActiveClients },
        ]);
        const messages = await axios.get(`${API}/trainer/getclientmessages`, {
          params: { trainerId: user.uid },
        });
        console.log('Client Messages', messages.data.clientMessages);
        const msgs = messages.data.clientMessages;
        const filteredMsgs = msgs.filter(
          (item) => item.messages && item.messages.length > 0
        );
        setClientMessages(filteredMsgs);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchRequests();
  }, [user]);

  const handleChange = async (id, name) => {
    setClient(id);
    setClientName(name);
    try {
      const res = await axios.get(`${API}/macros/getDailyMacros`, {
        params: { user: id },
      });
      setDailyMacrosData(res.data.userDailyMacrosData);
      const userGoals = await axios.get(`${API}/macros/getMAcroGoals`, {
        params: { user: id },
      });
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
    caloriesburned: item.caloriesburned,
  }));

  console.log('User daily macxros : ', userDailyMacros);

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
    return [...userDailyMacros].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];
  }, [userDailyMacros]);

  const updateSplit = (e) => {
    const { name, value } = e.target;
    setSplitGoals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateTrainerDetails = (e) => {
    const { name, value } = e.target;
    setTrainerDetails((prev) => ({
      ...prev,
      [name]: name === 'experience' || name === 'age' ? Number(value) : value,
    }));
  };

  const addToClient = async (id, name, goal) => {
    try {
      const response = await axios.post(`${API}/trainer/addclienttotrainer`, {
        trainerID: user.uid,
        userId: id,
        name,
        goal,
      });
      setActiveClients((prev) => [...prev, { userId: id, name, goal }]);
      removeClientRequest(id);
      setClientRequests((prev) => prev.filter((item) => item.userId !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeClientRequest = async (id) => {
    try {
      const response = await axios.post(`${API}/trainer/removeclientrequest`, {
        trainerID: user.uid,
        id: id,
      });
      setClientRequests((prev) => prev.filter((item) => item.userId !== id));
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    if (activeClients.length > 0 && !client) {
      handleChange(activeClients[0].userId, activeClients[0].name);
    }
  }, [activeClients, client]);

  const updateGoals = (e) => {
    const { name, value } = e.target;
    setNewGoals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editUserGoals = async (id) => {
    setClient(id);
    setGoalsPopUp(true);
    try {
      const res = await axios.get(`${API}/macros/getMAcroGoals`, {
        params: { user: id },
      });
      setUserPreviousGoals(res.data.macroGoals.goal);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateUserGoals = async () => {
    try {
      const updatedGoals = await axios.post(`${API}/macros/updateUserGoals`, {
        userId: client,
        updatedGoalValues: newGoals,
      });
    } catch (err) {
      console.log(err.message);
    }
    setGoalsPopUp(false);
  };

  const sendMessageToClient = async () => {
    try {
      const sendMessage = await axios.post(`${API}/trainer/messagetoclient`, {
        userId: client,
        message: messageToSend,
      });
      setSendMessagePopup(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const changeMessagePopupState = (id) => {
    setClient(id);
    setSendMessagePopup(true);
  };

  const editWorkoutSplit = async (id, name) => {
    setWorkoutSplitPopup(true);
  };

  const fillTrainerDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/trainer/filltrainerdetails`, {
        trainerId: user.uid,
        ...trainerDetails,
      });
      setDetailsFetched(true);
    } catch (err) {
      console.log('Error filling trainer details : ', err.message);
    }
  };
  const clearMessages = async (userId) => {
    try {
      const res = await axios.post(`${API}/trainer/clearmessages`, {
        clientId: userId,
        trainerId: user.uid,
      });
      setClientMessages((prev) => prev.filter((item) => item.id !== userId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const sendMessages = async (userId) => {
    if (!messageToSend.trim()) return;
    try {
      await axios.post(`${API}/trainer/messagetoclient`, {
        userId: userId,
        message: messageToSend,
      });
      setMessageToSend('');
    } catch (err) {
      console.log(err.message);
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const saveWorkoutSplit = async () => {
    try {
      const response = await axios.post(`${API}/trainer/updateworkoutsplit`, {
        splitGoals,
        userId: client,
      });
      setWorkoutSplitPopup(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  // const getClientName = async (id) => {
  //   try {
  //     const response = await axios.get(`${API}/user/getclientname`, {
  //       params: { userId: id },
  //     });
  //     return response.data.userName;
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  if (detailesFetched) {
    return loading ? (
      <LoadingAnimation />
    ) : (
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
              {/* </div> */}

              <div className="bg-white rounded-xl flex items-center justify-center min-h-[250px]">
                {renderContent(
                  requestsAcceptanceRatio?.filter((item) => item.count > 0),
                  <ChartPieSeparatorNone
                    requestsAcceptanceRatio={requestsAcceptanceRatio}
                  />
                )}
              </div>
              {workoutSplitPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-5 text-center">
                      Set Weekly Workout Split
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="Monday"
                        value={splitGoals.Monday}
                        onChange={updateSplit}
                        placeholder="Monday"
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="Tuesday"
                        value={splitGoals.Tuesday}
                        onChange={updateSplit}
                        placeholder="Tuesday"
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="Wednesday"
                        value={splitGoals.Wednesday}
                        onChange={updateSplit}
                        placeholder="Wednesday"
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="Thursday"
                        value={splitGoals.Thursday}
                        onChange={updateSplit}
                        placeholder="Thursday"
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="Friday"
                        value={splitGoals.Friday}
                        onChange={updateSplit}
                        placeholder="Friday"
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        name="Saturday"
                        value={splitGoals.Saturday}
                        onChange={updateSplit}
                        placeholder="Saturday"
                        className="border p-2 rounded"
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setWorkoutSplitPopup(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={saveWorkoutSplit}
                        className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
                      >
                        Save Split
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                      name="message"
                      value={messageToSend}
                      onChange={(e) => setMessageToSend(e.target.value)}
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
                        onClick={sendMessageToClient}
                        className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-100">
                {/* ===== ACTIVE CLIENTS ===== */}
                <h2 className="font-semibold mb-3">Active Clients</h2>

                {activeClients.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">
                    No active clients
                  </p>
                ) : (
                  activeClients.map((item) => (
                    <div
                      key={item.userId}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.goal}</p>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* Message Icon with Tooltip */}
                        <div className="relative group">
                          <LuMessageSquareText
                            className="cursor-pointer text-gray-600"
                            size={18}
                            onClick={() => changeMessagePopupState(item.userId)}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
                            Message
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        {/* Edit Macros Icon with Tooltip */}
                        <div className="relative group">
                          <BiEdit
                            size={18}
                            className="cursor-pointer text-gray-600"
                            onClick={() => editUserGoals(item.userId)}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
                            Update Macros
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        {/* Edit Split Icon with Tooltip */}
                        <div className="relative group">
                          <Dumbbell
                            size={18}
                            className="cursor-pointer text-gray-600"
                            onClick={() => editWorkoutSplit(item.userId)}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
                            Edit Split
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => handleChange(item.userId, item.name)}
                          className="text-xs bg-black hover:bg-gray-800 text-white px-3 py-1 rounded transition-colors"
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
                  <p className="text-sm text-gray-500 text-center">
                    No pending requests
                  </p>
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
                            addToClient(item.userId, item.name, item.goal)
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
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-xl">💬</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 text-base">
                        Client Messages
                      </h2>
                      <p className="text-xs text-gray-500">
                        {clientMessages.length} conversation(s)
                      </p>
                    </div>
                  </div>
                  {clientMessages.length > 0 && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {clientMessages.reduce(
                        (acc, item) => acc + item.messages.length,
                        0
                      )}{' '}
                      new
                    </div>
                  )}
                </div>

                {clientMessages.length > 0 ? (
                  <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-gray-50">
                    <Accordion
                      type="single"
                      collapsible
                      className="h-full overflow-y-auto p-3 space-y-3 scrollbar-hide"
                    >
                      {clientMessages.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                        >
                          {/* Client Header */}
                          <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                            <div className="flex items-center gap-3 w-full">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                  {item.name
                                    ?.toString()
                                    .charAt(0)
                                    .toUpperCase() || 'C'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>

                              <div className="text-left flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm mb-0.5 truncate">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {item.messages.length} message
                                    {item.messages.length !== 1 ? 's' : ''}
                                  </span>
                                  <span className="text-xs text-gray-300">
                                    •
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Active now
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                  <svg
                                    className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-transform group-data-[state=open]:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="p-0">
                            {/* Messages Section */}
                            <div className="px-4 py-3 bg-gradient-to-b from-gray-50 to-white max-h-56 overflow-y-auto space-y-3 scrollbar-hide">
                              {item.messages.map((msg, i) => (
                                <div
                                  key={i}
                                  className="flex gap-3 animate-slideIn"
                                  style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {item.name
                                      ?.toString()
                                      .charAt(0)
                                      .toUpperCase() || 'C'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-200 hover:border-blue-200 transition-colors">
                                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                                        {msg}
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 ml-2">
                                      Just now
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Reply Section */}
                            <div className="p-4 bg-white border-t border-gray-200">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={messageToSend}
                                    onChange={(e) =>
                                      setMessageToSend(e.target.value)
                                    }
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm bg-gray-50 hover:bg-white"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => clearMessages(item.id)}
                                    className="flex-1 sm:flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm border-2 border-transparent hover:border-gray-300"
                                  >
                                    🗑️ Clear
                                  </button>
                                  <button
                                    onClick={() => sendMessages(item.id)}
                                    className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                      />
                                    </svg>
                                    Send
                                  </button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-center p-8 sm:p-12">
                      <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-4xl">💬</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs">💤</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-base">
                        No Messages Yet
                      </h3>
                      <p className="text-sm text-gray-500 max-w-xs">
                        Your client conversations will appear here. Stay tuned!
                      </p>
                    </div>
                  </div>
                )}

                <style jsx>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateX(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(0);
                    }
                  }
                  .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                    opacity: 0;
                  }
                `}</style>
              </div>
            </div>
            <h4 className="text-center font-semibold">
              Client - {clientName} Progress
            </h4>

            {/* ===== BOTTOM ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto">
              <div className="bg-white h-80 lg:h-full rounded-xl p-4 overflow-y-auto">
                {renderContent(
                  userDailyMacros,
                  <CaloriesBarChart dailyMacrosData={userDailyMacros} />
                )}
              </div>

              <div className="bg-white rounded-xl p-4 overflow-y-auto h-full">
                {renderContent(
                  userDailyMacros,
                  <ChartTooltipDefault dailyMacrosData={userDailyMacros} />
                )}
              </div>

              <div className="bg-white rounded-xl p-5 overflow-auto">
                {renderContent(
                  todayEntry,
                  <ChartRadialLabel
                    todayEntry={todayEntry}
                    userGoals={userGoals}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } else {
    return loading ? (
      <LoadingAnimation />
    ) : (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-[95%] max-w-lg rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-5 text-center">
            Enter Trainer Details
          </h2>

          <form className="space-y-4" onSubmit={fillTrainerDetails}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={trainerDetails.name}
                onChange={updateTrainerDetails}
                type="text"
                required
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience (Years)
              </label>
              <input
                name="experience"
                value={trainerDetails.experience}
                onChange={updateTrainerDetails}
                type="number"
                required
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={trainerDetails.status}
                onChange={updateTrainerDetails}
                required
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                name="age"
                value={trainerDetails.age}
                onChange={updateTrainerDetails}
                type="number"
                required
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={trainerDetails.gender}
                onChange={updateTrainerDetails}
                required
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Proficiency */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Proficiency
              </label>
              <input
                name="speciality"
                value={trainerDetails.speciality}
                onChange={updateTrainerDetails}
                type="text"
                required
                placeholder="Strength Training, Yoga, Cardio..."
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={trainerDetails.description}
                onChange={updateTrainerDetails}
                required
                rows="3"
                placeholder="Briefly describe your training style..."
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input
                name="contact"
                value={trainerDetails.contact}
                onChange={updateTrainerDetails}
                type="text"
                required
                placeholder="Phone or Email"
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default TrainerDashboard;
