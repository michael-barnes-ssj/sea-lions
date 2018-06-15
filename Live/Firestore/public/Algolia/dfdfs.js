const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = "V49I282PT8";
const ALGOLIA_ADMIN_KEY = "b9731b1315ff89de3bf95c0f38aba08d";
const ALGOLIA_INDEX_NAME = 'sea-lions-otago';

admin.initializeApp(functions.config().firebase);

exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res)=> {
    
    var arr = [];

    admin.firestore().collection("Sea Lions").get().then((docs)=> {
        docs.forEach((doc)=> {
            let lion = doc.data();
            lion.objectID = doc.id;

            arr.push(lion);
        });

        console.log(arr);

        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
        var index = client.initIndex(ALGOLIA_INDEX_NAME);

        index.saveObjects(arr, function(err, content) {
            res.status(200).send(content);
        });
    })
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
