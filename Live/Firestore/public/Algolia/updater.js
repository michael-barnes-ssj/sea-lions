const algoliasearch = require('algoliasearch');
const functions = require('firebase-functions');
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'notes';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


// Update the search index every time a new sea lion is added
exports.onSeaLionCreated = functions.firestore.document('Sea Lions/{lionId}').onCreate((snap, context) => {
  // Get the note document
  const sealion = snap.data();

  // Add an 'objectID' field which Algolia requires
  sealion.objectID = context.params.lionId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(sealion);
});


// Update the search index every time a sealion is updated
exports.onSeaLionCreated = functions.firestore.document('Sea Lions/{lionId}').onUpdate((snap, context) => {
  // Get the note document
  const sealion = snap.data();

  // Add an 'objectID' field which Algolia requires
  sealion.objectID = context.params.lionId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(sealion);
});