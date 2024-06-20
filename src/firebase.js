import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyApTayzghtFyFy6wVEgcJ-Bn1zdBpzwKoc",
    authDomain: "yo-project-100.firebaseapp.com",
    projectId: "yo-project-100",
    storageBucket: "yo-project-100.appspot.com",
    messagingSenderId: "593938655514",
    appId: "1:593938655514:web:3f888f1fc54018dd5d24a3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();