import React,{ useState } from 'react'
import Dashboard from './Dashboard';
import TrainerDashboard from './TrainerDashboard';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from '../auth/firebase';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const token = await userCredential.user.getIdToken();

      if(role === 'trainer'){
        console.log("Registering as trainer");
        const res = await axios.post('http://localhost:8080/auth/trainerregister', {
          token,
          email,
          username
        });
        console.log(res.data);
      }
      else{
        const res = await axios.post("http://localhost:8080/auth/register", {
          token,
          email,
          username,
          role
        });
        console.log(res.data);
      }
      setUser({ uid: userCredential.user.uid });

      if(role === 'trainer') {
        navigate('/TrainerDashboard');
      } else {
        navigate('/Dashboard');
      }

    } catch (error) {
      console.error(error.code, error.message);
    }
  };

  const handleLogin = async () => {
  try {
    const userLoggedIn = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userLoggedIn.user.getIdToken();

    if (role === "trainer") {
      const res = await axios.post(
        "http://localhost:8080/auth/trainerlogin",
        { token }
      );

      if (res.data.trainer) {
        // setUser({ uid: userCredential.user.uid });
        navigate("/TrainerDashboard");
      }
    } else {
      const res = await axios.post(
        "http://localhost:8080/auth/login",
        { token }
      );

      if (res.data.user) {
        // setUser({uid:userLoggedIn.user.uid});
        navigate("/Dashboard");
      }
    }
    setUser({uid:userLoggedIn.user.uid});
  } catch (error) {
    console.error(error.code, error.message);
  }
};


  const googleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      await axios.post("http://localhost:8080/auth/googleSignin", { token });
      setUser({ uid: userCredential.user.uid });
      navigate('/Dashboard');
    } catch (error) {
      console.error(error.code, error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         Login As <select
              className="w-full mb-3 p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
        
        {mode === "register" && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
          </>
        )}

        {mode === "login" ? (
          <button
            onClick={handleLogin}
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded mb-3"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="cursor-pointer w-full bg-green-600 text-white py-2 rounded mb-3"
          >
            Register
          </button>
        )}

        <button
          onClick={googleSignin}
          className="cursor-pointer w-full border py-2 rounded mb-4 flex justify-center"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("register")}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;