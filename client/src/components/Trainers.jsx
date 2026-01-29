import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [trainerID, setTrainerID] = useState("");
  const {user} = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    months: "",
    age: "",
    proficiency: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/trainer/getTrainers"
        );
        setTrainers(res.data.trainers);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  const fillDetails = (trainerId) => {
    setTrainerID(trainerId);
    setDetailsPopup(true);
  };

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value
    }));
  }

  const addRequest = async (e) => {
    e.preventDefault();
    const payLoad = {
      id:trainerID,
      user:user.uid,
      ...formData
    }
    try{
      const res = await axios.post("http://localhost:8080/trainer/addrequest",payLoad);
      console.log("Selected Trainer ID:", trainerID);
      setDetailsPopup(false);
      setTrainerID("");
      setFormData({
        name: "",
        goal: "",
        months: "",
        age: "",
        proficiency: "",
      });
    }
    catch(err){
      err.message;
    }
  };

  if (!detailsPopup) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-6 pt-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Our Professional Trainers
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Choose from our certified fitness professionals to guide your journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {trainers.map((item) => (
            <div
              key={item.trainerId}
              className="group rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="overflow-hidden">
                <img
                  src="/trainer3.jpg"
                  alt="Trainer"
                  className="h-52 w-full object-fill group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item?.name}
                  </h2>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {item?.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {item?.experience} years •{" "}
                  <span className="text-red-500">
                    {item?.speciality}
                  </span>
                </p>

                <p className="text-sm h-14 overflow-auto text-gray-500 line-clamp-3">
                  {item?.description}
                </p>

                <button
                  onClick={() => fillDetails(item.trainerId)}
                  className="mt-4 w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
                >
                  Assign Trainer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-5" >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Fitness Details
        </h2>

        <form className="space-y-4" onSubmit={addRequest}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name = "name"
              value = {formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal
            </label>
            <input
              name = "goal"
              value = {formData.goal}
              onChange={handleChange}
              type="text"
              placeholder="Fat loss / Muscle gain"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Number of Months */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. of Months
            </label>
            <input
              type="number"
              name = "months"
              value = {formData.months}
              onChange={handleChange}
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name = "age"
              value = {formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency
            </label>
            <select
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              name = "proficiency"
              value = {formData.proficiency}
              onChange={handleChange} 
              required
            >
              <option value="">Select level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-xl bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Trainers;
