const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  "universe_domain": "googleapis.com"
}
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } 
  console.log("Firebase Initialized Successfully");
} catch (error) {
  console.error("Firebase not initialized");
  console.error(error); 
  process.exit(1);
}
module.exports = admin;




























// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD0gkbxrCat_vkODEOWfZmvbaQf-z0sZPw",
//   authDomain: "fitness-d9a67.firebaseapp.com",
//   projectId: "fitness-d9a67",
//   storageBucket: "fitness-d9a67.firebasestorage.app",
//   messagingSenderId: "790392132300",
//   appId: "1:790392132300:web:08bb82d9951f78979aa869",
//   measurementId: "G-3ZRK7481D8"
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);