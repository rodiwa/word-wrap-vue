import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDbjivuZniZvDSBKt1AUHKrXFZG3L2obB8",
  authDomain: "word-wrap.firebaseapp.com",
  databaseURL: "https://word-wrap.firebaseio.com",
  projectId: "word-wrap",
  storageBucket: "word-wrap.appspot.com",
  messagingSenderId: "405974091407"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp
