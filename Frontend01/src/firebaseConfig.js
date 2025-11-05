import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzsMcLNPtoRNjdW-U1RbjHAcsu6Jnaeyw",
  authDomain: "daywise-db1s2.firebaseapp.com",
  databaseURL: "https://daywise-db1s2-default-rtdb.firebaseio.com",
  projectId: "daywise-db1s2",
  storageBucket: "daywise-db1s2.appspot.com",
  messagingSenderId: "215823515831",
  appId: "1:215823515831:web:35c60a8d763b1656a34d32"
};

// Initialize the app 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// // ✅ Safe way to set testing property
// try {
//   if (auth.settings) {
//     auth.settings.appVerificationDisabledForTesting = true;
//   }
// } catch (error) {
//   console.log('Settings not available yet');
// }

// ✅ Wait for auth to initialize
setTimeout(() => {
  try {
    if (!auth.settings) {
      auth.settings = {};
    }
    auth.settings.appVerificationDisabledForTesting = true;
  } catch (error) {
    console.log('Could not set testing property');
  }
}, 500);


export { auth, RecaptchaVerifier, signInWithPhoneNumber };