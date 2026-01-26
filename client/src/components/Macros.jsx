import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Macros = () => {
  const [foodItem, setFoodItem] = useState("");
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    fibre: 0,
    calories: 0,
  });

  const { user } = useAuth();

  const getMacros = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/macros/getFoodMacros",
        { params: { foodItem } }
      );

      const nutrients = response.data.nutrients;

      setMacros({
        protein: parseInt(
          nutrients.find(n => n.nutrientName === "Protein")?.value || 0
        ),
        carbs: parseInt(
          nutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || 0
        ),
        fats: parseInt(
          nutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || 0
        ),
        fibre: parseInt(
          nutrients.find(n => n.nutrientName === "Fiber, total dietary")?.value || 0
        ),
        calories: parseInt(
          nutrients.find(n => n.nutrientName === "Energy")?.value || 0
        ),
      });
    } catch (err) {
      console.error("Error fetching macros:", err.message);
    }
  };

  const addMacros = async () => {
    try {
      await axios.post("http://localhost:8080/macros/addFoodMacros", {
        macros,
        userId: user.uid,
      });
    } catch (err) {
      console.error("Error adding macros:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] relative">

      {/* EXIT BUTTON */}
      <button
        className="fixed top-4 right-4 px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:opacity-90 z-10"
        onClick={() => window.history.back()}
      >
        Exit
      </button>

      {/* CENTERED CARD */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">

          {/* HEADER */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#111111]">
              Food Macros
            </h2>
            <p className="text-sm text-[#6B7280]">
              Search food to view nutrition details
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Search food item"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB]
                         focus:outline-none focus:ring-2 focus:ring-[#D6F34A]"
            />
            <button
              onClick={getMacros}
              className="px-5 rounded-xl bg-[#D6F34A] text-black font-medium hover:opacity-90"
            >
              Get
            </button>
          </div>

          {/* CALORIES */}
          <div className="bg-[#F7F7F7] rounded-2xl p-4 text-center mb-5">
            <p className="text-sm text-[#6B7280]">Calories</p>
            <p className="text-3xl font-semibold text-[#FF4D4F]">
              {macros.calories} kcal
            </p>
          </div>

          {/* MACROS GRID */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <MacroStat label="Protein" value={macros.protein} />
            <MacroStat label="Carbs" value={macros.carbs} />
            <MacroStat label="Fats" value={macros.fats} />
            <MacroStat label="Fiber" value={macros.fibre} />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={addMacros}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:opacity-90"
          >
            Add to Daily Nutrition
          </button>

        </div>
      </div>
    </div>
  );
};

/* MACRO CARD */
const MacroStat = ({ label, value }) => (
  <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
    <p className="text-xs text-[#6B7280]">{label}</p>
    <p className="text-lg font-semibold text-[#111111]">
      {value}g
    </p>
  </div>
);

export default Macros;
