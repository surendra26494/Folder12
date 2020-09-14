import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCfO-j8nK64RGhBpsEKNBFMXO3qK-QcqXE",
  authDomain: "crown-db-c054b.firebaseapp.com",
  databaseURL: "https://crown-db-c054b.firebaseio.com",
  projectId: "crown-db-c054b",
  storageBucket: "crown-db-c054b.appspot.com",
  messagingSenderId: "617918575788",
  appId: "1:617918575788:web:2759e06747213e28601b09",
  measurementId: "G-52JVV557VY"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
