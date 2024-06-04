import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCUWdUtxadXKC9kIei2jjRuAoWLns5e9ZQ",
  authDomain: "social-fce4b.firebaseapp.com",
  projectId: "social-fce4b",
  storageBucket: "social-fce4b.appspot.com",
  messagingSenderId: "375258248324",
  appId: "1:375258248324:web:d2503c5e551b0206b7bed1",
  measurementId: "G-T0CWFD7R9J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;