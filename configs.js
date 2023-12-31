export const baseUrl = "http://localhost:8080";
// export const baseUrl = "https://chat-app-backend-iota-drab.vercel.app";

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAfqzrlO527sIVcdXBHYpLOugAXZUuUnQ0",
  authDomain: "chat-app-75d17.firebaseapp.com",
  projectId: "chat-app-75d17",
  storageBucket: "chat-app-75d17.appspot.com",
  messagingSenderId: "990647970498",
  appId: "1:990647970498:web:0f4f37714cc2d7d0f3295b",
};

const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp);
