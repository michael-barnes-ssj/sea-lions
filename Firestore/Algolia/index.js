const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID
});
const database = firebase.firestore();

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

database.collection("Sea Lions").get().then((docs)=> {
    let records = [];
    docs.forEach((doc)=> {
        let lion = doc.data();
        lion.objectID = doc.id;

        records.push(lion);
    });

    console.log(records);

    // Add or update new objects
    index
    .saveObjects(records)
    .then(() => {
      console.log('Sealions imported into Algolia');
    })
    .catch(error => {
      console.error('Error when importing sealion into Algolia', error);
      process.exit(1);
    });
});
  