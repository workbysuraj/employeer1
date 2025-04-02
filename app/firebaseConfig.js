// Import Firebase dependencies
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHKAvu9VCz83LHimlpl3FyR1pzsOc-URE",
  authDomain: "suraj-35feb.firebaseapp.com",
  projectId: "suraj-35feb",
  storageBucket: "suraj-35feb.appspot.com",
  messagingSenderId: "96209477818",
  appId: "1:96209477818:web:f831dfe2ec96634ab02283",
  measurementId: "G-PHGBFSZWT9",
};

// ✅ Ensure Firebase initializes only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Initialize Auth with AsyncStorage for persistence
const auth = getApps().length
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// ✅ Export Firebase services
export { app, auth, db };
