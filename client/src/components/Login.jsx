import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from '../auth/firebase';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async()=>{
    try{
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const token = await userCredential.user.getIdToken();
      await axios.post('http://localhost:8080/auth/register',{token,email,username,role});
      console.log("User registered token sent to server");
    }
    catch(error){
      console.error(error.code,error.message);
    }
  }

  const handleLogin = async()=>{
    try{
      const userLoggedIn = await signInWithEmailAndPassword(auth,email,password);
      const token = await userLoggedIn.user.getIdToken();
      const userDetails = await axios.post('http://localhost:8080/auth/login',{token});
      console.log(userDetails.data);
    }
    catch(error){
      console.error(error.code,error.message);
    }
  }

  const googleSignin = async()=>{
    try{
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth,provider);
      const token = await userCredential.user.getIdToken();
      const userDeatils = await axios.post('http://localhost:8080/auth/googleSignin',{token});
      console.log(userDeatils.data);
    }
    catch(error){
      console.error(error.code,error.message);
    }
  }

  return (
    <>
    <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
    <select name="role" id="role" value={role} onChange={(e)=>setRole(e.target.value)}>
      <option value="user">User</option>
      <option value="trainer">Trainer</option>
    </select>
    <button onClick={handleRegister}>Register</button>
    <button onClick={handleLogin}>Login</button>
    <button onClick={googleSignin}>Signin With Google</button>
    </>
  )
}

export default Login