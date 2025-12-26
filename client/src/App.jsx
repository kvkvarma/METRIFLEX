import { useState } from 'react'
import './App.css'
import {auth} from '../firebase';
import { GoogleAuthProvider,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  const handleEmailPasswordRegister = async()=>{
    try{
      const userCredential = await createUserWithEmailAndPassword(auth,username,password);
      const token = userCredential.user.accessToken;
      await axios.post('http://localhost:8080/login',{token});
      console.log("User registered and token sent to server");
    }
    catch(error){
      console.error(error.code,error.message);
    }
  }
  
  return (
    <>
    <input type="text" name="username" id="username" onChange={(e)=>setUsername(e.target.value)}/>
    <input type="password" name="password" id="password" onChange={(e)=>setPassword(e.target.value)} />
    <button type="button" onClick={handleEmailPasswordRegister}>Submit</button>
    </>
  )
}

export default App
