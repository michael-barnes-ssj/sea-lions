const algoliasearch = require('algoliasearch');
const functions = require('firebase-functions');
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
// const ALGOLIA_ID = functions.config().algolia.app_id;
// const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_ID = 'V49I282PT8';
const ALGOLIA_ADMIN_KEY = 'b9731b1315ff89de3bf95c0f38aba08d';
const ALGOLIA_SEARCH_KEY = '36e156d06bfa536da4820072fd64309d';

const ALGOLIA_INDEX_NAME = 'sea-lions-otago';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


//console.log(ALGOLIA_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_SEARCH_KEY);

// Update the search index every time a new sea lion is added
exports.onSeaLionCreated = functions.firestore.document('test/{lionId}').onCreate((snap, context) => {
  // Get the note document
  const sealion = snap.data();

  // Add an 'objectID' field which Algolia requires
  sealion.objectID = context.params.lionId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(sealion, function(err, content) {
    if (err) {
      console.log(err.message);
      console.log(err.debugData);
      throw err;
    }
    console.log('Firestore<>Algolia object saved', sealion.objectID);
  });
});

// // Update the search index every time a new sea lion is added
// exports.onSeaLionCreated = functions.firestore.document('Sea Lions/{lionId}').onCreate((snap, context) => {
//   // Get the note document
//   const sealion = snap.data();

//   // Add an 'objectID' field which Algolia requires
//   sealion.objectID = context.params.lionId;

//   // Write to the algolia index
//   const index = client.initIndex(ALGOLIA_INDEX_NAME);
//   return index.saveObject(sealion);
// });


// // Update the search index every time a sealion is updated
// exports.onSeaLionUpdated = functions.firestore.document('Sea Lions/{lionId}').onUpdate((snap, context) => {
//   // Get the note document
//   const sealion = snap.data();

//   // Add an 'objectID' field which Algolia requires
//   sealion.objectID = context.params.lionId;

//   // Write to the algolia index
//   const index = client.initIndex(ALGOLIA_INDEX_NAME);
//   return index.saveObject(sealion);
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// exports.new = functions.firestore.document('Sea Lions/{lionId}').onCreate((snap, context) => {
//   const sealion = snap.data();
// });