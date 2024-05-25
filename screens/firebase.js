// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8oX9gw9-ZmyoCcYguAtWwL08lZ_spjH8",
  authDomain: "soulsync-f2360.firebaseapp.com",
  projectId: "soulsync-f2360",
  storageBucket: "soulsync-f2360.appspot.com",
  messagingSenderId: "426051036596",
  appId: "1:426051036596:web:865309ba6914ef3d6dfee1",
  measurementId: "G-FJENED45D5",
  databaseURL:'https://soulsync-f2360-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);

export { app, database, auth, ref, onValue,firestore,storage,sendPasswordResetEmail};
