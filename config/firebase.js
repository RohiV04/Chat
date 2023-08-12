import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCKio2r9gyCuCEDp5vXss9UHiHjw4Hxwfk",
  authDomain: "chat-app-9abdf.firebaseapp.com",
  projectId:"chat-app-9abdf",
  storageBucket: "chat-app-9abdf.appspot.com",
  messagingSenderId: "817216851574",
  appId: "1:817216851574:web:7c81b822993b418d525957",
  databaseURL: "G-9KP5LE7HG9"
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();