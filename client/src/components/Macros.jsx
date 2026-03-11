import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Macros = () => {
  const [foodItem, setFoodItem] = useState('');
  const [grams, setGrams] = useState(100);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    fibre: 0,
    calories: 0,
  });

  const { user } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  const getMacros = async () => {
    if (!foodItem) return;

    try {
      const response = await axios.get(`${API}/macros/getFoodMacros`, {
        params: { foodItem },
      });

      const nutrients = response.data.nutrients;

      const scale = grams / 100;

      setMacros({
        protein: parseFloat(
          (
            (nutrients.find((n) => n.nutrientName === 'Protein')?.value || 0) *
            scale
          ).toFixed(1)
        ),
        carbs: parseFloat(
          (
            (nutrients.find(
              (n) => n.nutrientName === 'Carbohydrate, by difference'
            )?.value || 0) * scale
          ).toFixed(1)
        ),
        fats: parseFloat(
          (
            (nutrients.find((n) => n.nutrientName === 'Total lipid (fat)')
              ?.value || 0) * scale
          ).toFixed(1)
        ),
        fibre: parseFloat(
          (
            (nutrients.find((n) => n.nutrientName === 'Fiber, total dietary')
              ?.value || 0) * scale
          ).toFixed(1)
        ),
        calories: parseFloat(
          (
            (nutrients.find((n) => n.nutrientName === 'Energy')?.value || 0) *
            scale
          ).toFixed(0)
        ),
      });
    } catch (err) {
      console.error('Error fetching macros:', err.message);
    }
  };

  const addMacros = async () => {
    try {
      await axios.post(`${API}/macros/addFoodMacros`, {
        macros,
        userId: user.uid,
        grams,
        foodItem,
      });
    } catch (err) {
      console.error('Error adding macros:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] relative flex items-center justify-center px-4">
      {/* EXIT BUTTON */}
      <button
        className="fixed top-4 right-4 px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:opacity-90"
        onClick={() => window.history.back()}
      >
        Exit
      </button>

      {/* CARD */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Food Macros</h2>
          <p className="text-sm text-gray-500">
            Search food and calculate nutrition based on grams
          </p>
        </div>

        {/* SEARCH SECTION */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search food item"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            className="w-full sm:w-28 px-4 py-3 rounded-xl border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Grams"
          />

          <button
            onClick={getMacros}
            className="px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold 
                       hover:scale-105 transition"
          >
            Get
          </button>
        </div>

        {/* CALORIES CARD */}
        <div
          className="bg-gradient-to-r from-red-50 to-red-100 
                        rounded-2xl p-6 text-center mb-6 shadow-md"
        >
          <p className="text-sm text-gray-600">Calories</p>
          <p className="text-4xl font-bold text-red-500">
            {macros.calories} kcal
          </p>
        </div>

        {/* MACROS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <MacroStat label="Protein" value={macros.protein} />
          <MacroStat label="Carbs" value={macros.carbs} />
          <MacroStat label="Fats" value={macros.fats} />
          <MacroStat label="Fiber" value={macros.fibre} />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={addMacros}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold 
                     hover:scale-105 transition"
        >
          Add to Daily Nutrition
        </button>
      </div>
    </div>
  );
};

/* MACRO STAT CARD */
const MacroStat = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xl font-semibold text-gray-900">{value} g</p>
  </div>
);

export default Macros;
