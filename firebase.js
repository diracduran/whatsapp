import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyDtIin-3s20LnsAc-J3J6xpKgBhQcvI9zY",
    authDomain: "whatsappnextjs-efaee.firebaseapp.com",
    projectId: "whatsappnextjs-efaee",
    storageBucket: "whatsappnextjs-efaee.appspot.com",
    messagingSenderId: "255446595166",
    appId: "1:255446595166:web:2c78021154af3de994e6cf"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();


export {db, auth, provider};