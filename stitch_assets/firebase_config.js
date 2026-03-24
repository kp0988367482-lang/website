// ============================================================
// firebase_config.js — SeoulMate Firebase Integration
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const runtimeConfig = window.__SEOULMATE_FIREBASE_CONFIG__ || {};
const firebaseConfig = {
    apiKey: runtimeConfig.apiKey || "",
    authDomain: runtimeConfig.authDomain || "",
    projectId: runtimeConfig.projectId || "",
    storageBucket: runtimeConfig.storageBucket || "",
    messagingSenderId: runtimeConfig.messagingSenderId || "",
    appId: runtimeConfig.appId || ""
};
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
const isFirebaseConfigured = requiredKeys.every((key) => Boolean(firebaseConfig[key]));

let app = null;
let auth = null;
let db = null;

window.FirebaseSDK = null;

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        window.FirebaseSDK = { auth, db, doc, setDoc, getDoc, collection, addDoc };
        console.log('🔥 Firebase Integration Initialized');
    } catch (error) {
        console.warn('Firebase initialization skipped:', error.message);
    }
} else {
    console.info('Firebase optional integration disabled. Set window.__SEOULMATE_FIREBASE_CONFIG__ before loading firebase_config.js to enable it.');
}

export { auth, db };
