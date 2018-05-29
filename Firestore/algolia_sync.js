const sealionsRef = database.ref('/contacts');
sealionsRef.on('child_added', addOrUpdateIndexRecord);
sealionsRef.on('child_changed', addOrUpdateIndexRecord);
sealionsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(sealion) {
  // Get Firebase object
  const record = sealion.val();
  // Specify Algolia's objectID using the Firebase object key
  record.objectID = sealion.key;
  // Add or update object
  index
    .saveObject(record)
    .then(() => {
      console.log('Firebase object indexed in Algolia', record.objectID);
    })
    .catch(error => {
      console.error('Error when indexing contact into Algolia', error);
      process.exit(1);
    });
}

function deleteIndexRecord(sealion) {
  // Get Algolia's objectID from the Firebase object key
  const objectID = sealion.key;
  // Remove the object from Algolia
  index
    .deleteObject(objectID)
    .then(() => {
      console.log('Firebase object deleted from Algolia', objectID);
    })
    .catch(error => {
      console.error('Error when deleting contact from Algolia', error);
      process.exit(1);
    });
}
