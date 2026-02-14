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

  const [sendMessagePopup, setSendMessagePopup] = useState(false);

  const [workoutSplitPopup, setWorkoutSplitPopup] = useState(false);
  const [targetUserGoals, setTargetUserGoals] = useState({});
  const [messageToSend, setMessageToSend] = useState('');

  const [detailesFetched, setDetailsFetched] = useState(false);

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

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      try {
        const response = await axios.get(
          'http://localhost:8080/trainer/gettrainerrequests',
          { params: { id: user.uid } }
        );
        setClientRequests(response.data.requests);
        setActiveClients(response.data.activeclients);
        setDetailsFetched(response.data.detailsFetched);
        setRequestsAcceptanceRatio([
          { name: 'Rejected Requests', count: response.data.rejectedRequests },
          { name: 'Total Requests', count: response.data.totalReuqests },
          { name: 'Active Requests', count: response.data.totalActiveClients },
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
        'http://localhost:8080/macros/getDailyMacros',
        { params: { user: id } }
      );
      setDailyMacrosData(res.data.userDailyMacrosData);
      const userGoals = await axios.get(
        'http://localhost:8080/macros/getMAcroGoals',
        {
          params: { user: id },
        }
      );
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
      const res = await axios.get(
        'http://localhost:8080/macros/getMAcroGoals',
        { params: { user: id } }
      );
      setUserPreviousGoals(res.data.macroGoals.goal);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateUserGoals = async () => {
    try {
      const updatedGoals = await axios.post(
        'http://localhost:8080/macros/updateUserGoals',
        { userId: client, updatedGoalValues: newGoals }
      );
    } catch (err) {
      console.log(err.message);
    }
    setGoalsPopUp(false);
  };

  const sendMessageToClient = async () => {
    try {
      const sendMessage = await axios.post(
        'http://localhost:8080/trainer/messagetoclient',
        { userId: client, message: messageToSend }
      );
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
      const response = await axios.post(
        'http://localhost:8080/trainer/filltrainerdetails',
        {
          trainerId: user.uid,
          ...trainerDetails,
        }
      );
      setDetailsFetched(true);
    } catch (err) {
      console.log('Error filling trainer details : ', err.message);
    }
  };

  const saveWorkoutSplit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/trainer/updateworkoutsplit',
        { splitGoals, userId: client }
      );
      setWorkoutSplitPopup(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  if (!detailesFetched) {
    return (
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
  } else {
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
                        <LuMessageSquareText
                          className="cursor-pointer"
                          size={18}
                          onClick={() => changeMessagePopupState(item.userId)}
                        />

                        <BiEdit
                          size={18}
                          className="cursor-pointer"
                          onClick={() => editUserGoals(item.userId)}
                        />

                        <Dumbbell
                          size={18}
                          className="cursor-pointer"
                          onClick={() => editWorkoutSplit(item.userId)}
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
                            addToClient(
                              item.userId,
                              item.name,
                              item.goal,
                              item.plan
                            )
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
            <h4 className="text-center font-semibold">
              Client - {clientName} Progress
            </h4>

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

              <div className=" bg-white rounded-xl p-5 overflow-auto">
                <ChartRadialLabel
                  todayEntry={todayEntry}
                  userGoals={userGoals}
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
};

export default TrainerDashboard;
