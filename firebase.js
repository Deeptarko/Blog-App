// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWPoDMuaDrerTIdfzFrgiUXKhNSc43tFM",
  authDomain: "blog-app-854b2.firebaseapp.com",
  projectId: "blog-app-854b2",
  storageBucket: "blog-app-854b2.appspot.com",
  messagingSenderId: "1067470672005",
  appId: "1:1067470672005:web:6534e801d86b6e852319ec",
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
