// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBSPo3MExZWUjJhiic_jieQxe025LGr5Fk",
  authDomain: "wicket-journeys.firebaseapp.com",
  projectId: "wicket-journeys",
  storageBucket: "wicket-journeys.appspot.com",
  messagingSenderId: "533620318989",
  appId: "1:533620318989:web:2c8ff0842768b31d29c644",
  measurementId: "G-111EC7BCBE"
};

const __firebaseApp = initializeApp(firebaseConfig);

export { __firebaseApp };