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
import { Mail, Lock, User, Chrome, Dumbbell, ArrowRight } from 'lucide-react';

// const API = 'http://localhost:8080';
const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [step, setStep] = useState('role'); // 'role' -> 'auth' -> 'otp'
  const [mode, setMode] = useState('login');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: '',
  });

  const { email, password, username, role } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep('auth');
  };

  const redirectUser = (role) => {
    if (role === 'trainer') {
      navigate('/TrainerDashboard');
    } else {
      navigate('/Dashboard');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/sendOtp`, {
        email,
        username,
        role,
      });
      alert('OTP sent to email');
      setShowOtp(true);
    } catch (error) {
      alert('Otp Not Sent!');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${API}/auth/verifyOtp`, {
        email,
        otp,
      });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      await axios.post(`${API}/auth/register`, {
        token,
        email,
        username,
        role,
      });
      redirectUser(role);
    } catch (error) {
      alert('OTP verification failed');
    }
  };

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

  const googleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();

      // Send role with Google signin
      const res = await axios.post(`${API}/auth/googleSignin`, {
        token,
        role, // Include selected role
      });

      setUser({ uid: userCredential.user.uid });
      redirectUser(role);
    } catch (error) {
      console.error(error.code, error.message);
      alert('Google sign in failed');
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6 md:p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {step === 'role'
              ? 'Choose Your Path'
              : mode === 'login'
                ? 'Welcome Back'
                : 'Create Account'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            {step === 'role'
              ? 'Are you here to train or be trained?'
              : mode === 'login'
                ? 'Sign in to continue your fitness journey'
                : 'Start your fitness transformation today'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* STEP 1: Role Selection */}
            {step === 'role' && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
                  Select Your Role
                </h3>

                <button
                  onClick={() => selectRole('user')}
                  className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl sm:text-3xl">💪</span>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                        I'm a User
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Looking to get fit and track my progress
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                </button>

                <button
                  onClick={() => selectRole('trainer')}
                  className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl sm:text-3xl">🏋️</span>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                        I'm a Trainer
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Ready to help others achieve their goals
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: Auth Form */}
            {step === 'auth' && !showOtp && (
              <>
                {/* Back Button */}
                <button
                  onClick={() => {
                    setStep('role');
                    setFormData({ ...formData, role: '' });
                  }}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  ← Change role
                </button>

                {/* Selected Role Badge */}
                <div className="mb-4 sm:mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-center">
                    <span className="font-semibold text-gray-700">
                      Signing in as:
                    </span>{' '}
                    <span className="font-bold text-blue-600 capitalize">
                      {role}
                    </span>
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      value={email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      value={password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Username (Register only) */}
                {mode === 'register' && (
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Your username"
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                        value={username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={mode === 'login' ? handleLogin : handleRegister}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mb-3 sm:mb-4"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={googleSignin}
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 hover:border-gray-300 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-gray-50 mb-4 sm:mb-6"
                >
                  <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <span className="font-semibold text-gray-700">Google</span>
                </button>

                {/* Toggle Mode */}
                <p className="text-center text-xs sm:text-sm text-gray-600">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setMode('register')}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </>
            )}

            {/* STEP 3: OTP Verification */}
            {showOtp && (
              <>
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Verify Your Email
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 px-4">
                    We've sent a code to{' '}
                    <span className="font-semibold">{email}</span>
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-center text-xl sm:text-2xl tracking-widest font-bold"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={verifyOtp}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Verify & Continue
                </button>

                <button
                  onClick={() => setShowOtp(false)}
                  className="w-full mt-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4 sm:mt-6 px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
