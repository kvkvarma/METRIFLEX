import React from 'react';
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutSplit from './components/WorkoutSplit';
import Macros from './components/Macros';
import Sidebar from './components/Sidebar';
function App() {
  return (
     
     <Routes>
    <Route path="/" element={<Login />} />
    <Route element={<Sidebar />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/workoutsplits" element={<WorkoutSplit />} />
      <Route path="/macros" element={<Macros />} />
    </Route>
</Routes>

  );
}

export default App;
