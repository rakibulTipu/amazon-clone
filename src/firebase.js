import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCmkMtMl_DgmR9IlPIIVSv_p0Kd09ikEmM",
  authDomain: "clone-f540f.firebaseapp.com",
  projectId: "clone-f540f",
  storageBucket: "clone-f540f.appspot.com",
  messagingSenderId: "832643863676",
  appId: "1:832643863676:web:84b2563f94eae1de7d65f9",
  measurementId: "G-DB7GRFTR8N",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
