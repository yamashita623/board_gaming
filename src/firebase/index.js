import firebase from 'firebase';
import 'firebase/auth';

  const firebaseConfig = {
  apiKey: "AIzaSyBtRBPy1OQIKekoQqkWcBcFVL9ugG1D524",
  authDomain: "boardgame-5bfbd.firebaseapp.com",
  projectId: "boardgame-5bfbd",
  storageBucket: "boardgame-5bfbd.appspot.com",
  messagingSenderId: "809513343346",
  appId: "1:809513343346:web:01689bb137de4ebed925eb"
};
  
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
export default db
