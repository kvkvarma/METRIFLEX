// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0gkbxrCat_vkODEOWfZmvbaQf-z0sZPw",
  authDomain: "fitness-d9a67.firebaseapp.com",
  projectId: "fitness-d9a67",
  storageBucket: "fitness-d9a67.firebasestorage.app",
  messagingSenderId: "790392132300",
  appId: "1:790392132300:web:08bb82d9951f78979aa869",
  measurementId: "G-3ZRK7481D8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export {auth,app};