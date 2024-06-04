import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/init'

const firebaseConfig = {
  apiKey: "AIzaSyCn7gPLqR8bOByhTNLOIdQy9AVCiZdpTe0",
  authDomain: "twitterclone-bfcc7.firebaseapp.com",
  projectId: "twitterclone-bfcc7",
  storageBucket: "twitterclone-bfcc7.appspot.com",
  messagingSenderId: "396150036352",
  appId: "1:396150036352:web:da671ed8bc3cc698899365",
  measurementId: "G-0D7WTHVGY4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;