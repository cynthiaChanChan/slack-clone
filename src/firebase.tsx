import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA2HYPdyq26Pf8-WnVBlOsukl8c7p5Lpao",
    authDomain: "slack-clone-d66a9.firebaseapp.com",
    databaseURL: "https://slack-clone-d66a9.firebaseio.com",
    projectId: "slack-clone-d66a9",
    storageBucket: "slack-clone-d66a9.appspot.com",
    messagingSenderId: "607252815711",
    appId: "1:607252815711:web:013ffd2d40ba39c62120ea",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
