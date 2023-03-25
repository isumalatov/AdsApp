// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3b6UBl5pQNatg8XQAumtaW9HBzKPneEw",
  authDomain: "sortea2-tarjetas-regalo.firebaseapp.com",
  databaseURL: "https://sortea2-tarjetas-regalo.firebaseio.com",
  projectId: "sortea2-tarjetas-regalo",
  storageBucket: "sortea2-tarjetas-regalo.appspot.com",
  messagingSenderId: "153438029438",
  appId: "1:153438029438:web:1c5052eb46460ef6dfba2f",
  measurementId: "G-X2XM593QV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
 
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,  
  useFetchStreams: false,  
 })
 
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth };