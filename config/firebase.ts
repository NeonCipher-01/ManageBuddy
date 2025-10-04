import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMd4KjRqHxxykFeozNJFgdi4Hoz1kWe3c",
  authDomain: "managebuddy-85ddf.firebaseapp.com",
  projectId: "managebuddy-85ddf",
  storageBucket: "managebuddy-85ddf.firebasestorage.app",
  messagingSenderId: "297906293663",
  appId: "1:297906293663:web:7e2f926e7366c318c70baa",
  measurementId: "G-6M2755Y5EC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
