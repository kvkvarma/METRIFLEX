import { useState } from 'react'
import './App.css'

import Login from './components/Login';
import Macros from './components/Macros';
function App() {
  return (
    <div className="App">
      <Login />
      <Macros/>
    </div>
  )
}

export default App
  