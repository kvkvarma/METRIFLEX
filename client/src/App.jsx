import React from 'react';
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutSplit from './components/WorkoutSplit';
import Macros from './components/Macros';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/trainers" element={<Trainers />} /> */}
      <Route path="/workout-splits" element={<WorkoutSplit />} />
      <Route path="/macros" element={<Macros />} />
    </Routes>
  );
}

export default App;
