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
  const collectionRef = firestore.collection('users');
  const snapShot = await userRef.get();
  const collectionSnapshot = await collectionRef.get();
  console.log(collectionSnapshot)
  console.log({ collection: collectionSnapshot.docs.map(doc => doc.data()) })

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
export const addCollectionAndDocments = async (collectionKey, objectsToAdd) => {
  const collectionReff = firestore.collection(collectionKey);
  console.log(collectionReff);

  const batch = firestore.batch();
  objectsToAdd.forEach(element => {
    const newDocRef = collectionReff.doc();
    batch.set(newDocRef, element)
  });
  return await batch.commit();
}
export const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
