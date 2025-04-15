// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABitOp5-H2MINbdemYTVtFsaYYvi-qY00",
  authDomain: "myruta-3e12f.firebaseapp.com",
  projectId: "myruta-3e12f",
  storageBucket: "myruta-3e12f.firebasestorage.app",
  messagingSenderId: "65267517314",
  appId: "1:65267517314:web:a342c95e20538711adb19b",
  measurementId: "G-L0GPDBYFTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage persistence
const auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Export only what you use
export { auth, db };
