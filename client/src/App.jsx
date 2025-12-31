import React from 'react';
import { useState } from 'react'
import './App.css'

import Login from './components/Login';
import Macros from './components/Macros';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <div className="App">
      <Dashboard />
      {/* <Login />
      <Macros/> */}
    </div>
  )
}

export default App
