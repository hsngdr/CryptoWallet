import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCeSMvuND6J4ugb8llAqP9FPA9QAbluHRQ",
    authDomain: "cryptowallet-8425c.firebaseapp.com",
    projectId: "cryptowallet-8425c",
    storageBucket: "cryptowallet-8425c.appspot.com",
    messagingSenderId: "10008039115",
    appId: "1:10008039115:web:df3a1e4e6a62a0366ed54e"
  };

  const firebaseApp =initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);

  const auth= getAuth(firebaseApp);


  const provider= new GoogleAuthProvider();

  export default db;
  export {auth, provider};