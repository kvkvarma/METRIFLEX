import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../auth/firebase';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from './LoadingAnimation';

const API = 'http://localhost:8080';
// const API = import.meta.env.VITE_API_URL;
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [mode, setMode] = useState('login');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'user',
  });

  const { email, password, username, role } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const redirectUser = (role) => {
    if (role === 'trainer') {
      navigate('/TrainerDashboard');
    } else {
      navigate('/Dashboard');
    }
  };
  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();
      setToken(idToken);

      await axios.post(`${API}/auth/sendOtp`, {
        token: idToken,
        email,
        username,
        role,
      });

      alert('OTP sent to your email');
      setShowOtp(true);
    } catch (error) {
      console.error(error.code, error.message);
      alert(error.message);
    }
  };

  // ---------------- VERIFY OTP ----------------
  // const verifyOtp = async () => {
  //   try {
  //     const endpoint =
  //       role === 'trainer' ? '/auth/trainerregister' : '/auth/register';

  //     await axios.post(`${API}${endpoint}`, {
  //       token,
  //       email,
  //       username,
  //     });

  //     setUser({ email });
  //     redirectUser(role);
  //   } catch (error) {
  //     console.error(error);
  //     alert('OTP verification failed');
  //   }
  // };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCredential.user.getIdToken();

      const endpoint =
        role === 'trainer' ? '/auth/trainerlogin' : '/auth/login';

      const res = await axios.post(`${API}${endpoint}`, { token });

      if (res.data.user || res.data.trainer) {
        setUser({ uid: userCredential.user.uid });
        redirectUser(role);
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const googleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);

      const token = await userCredential.user.getIdToken();

      const res = await axios.post(`${API}/auth/googleSignin`, { token });

      setUser({ uid: userCredential.user.uid });

      redirectUser(res.data.role || 'user');
    } catch (error) {
      console.error(error.code, error.message);
    }
  };

  // ---------------- LOADER ----------------
  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        {!showOtp && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={handleChange}
            />

            {mode === 'register' && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full mb-3 p-2 border rounded"
                value={username}
                onChange={handleChange}
              />
            )}

            <select
              name="role"
              className="w-full mb-3 p-2 border rounded"
              value={role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
          </>
        )}

        {showOtp && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-3 p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {!showOtp &&
          (mode === 'login' ? (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 rounded mb-3"
            >
              Register
            </button>
          ))}

        {!showOtp && (
          <>
            <button
              onClick={googleSignin}
              className="w-full border py-2 rounded mb-4 flex justify-center"
            >
              Continue with Google
            </button>

            <p className="text-center text-sm">
              {mode === 'login' ? (
                <>
                  Don’t have an account?{' '}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setMode('register')}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setMode('login')}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
