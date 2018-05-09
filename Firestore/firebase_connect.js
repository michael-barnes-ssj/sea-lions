// Initialize Firebase
var config = {
    apiKey: "AIzaSyBSFk4CDdTukTOVHYte2ZG1kV2bjetNG-I",
    authDomain: "sea-lions-otago.firebaseapp.com",
    databaseURL: "https://sea-lions-otago.firebaseio.com",
    projectId: "sea-lions-otago",
    storageBucket: "sea-lions-otago.appspot.com",
    messagingSenderId: "686540698265"
};

firebase.initializeApp(config);
var db = firebase.firestore();

