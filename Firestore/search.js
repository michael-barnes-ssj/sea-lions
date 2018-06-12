// Index of form input id needs to align with the index on the sealion index field to correctly populate the map
const formInputIds = ['name', 'mother', 'pob', 'gender', 'transponder', 'living_status', 'tagcolour', 'tagtype', 'tagnumber', 'rfnumber', 'leftone', 'lefttwo', 'leftthree', 'leftfour', 'leftfive', 'rightone', 'righttwo', 'rightthree', 'rightfour', 'rightfive'];
const sealionIndexFields = ['name', 'mother', 'pob', 'gender', 'transponder', 'living_status', 'colour', 'type', 'tag_number', 'rf_number', 'left1', 'left2', 'left3', 'left4', 'left5', 'right1', 'right2', 'right3', 'right4', 'right5'];
const formInputIdsExclCheckboxes = ['name', 'mother', 'pob', 'gender', 'transponder', 'living_status', 'tagcolour', 'tagtype', 'tagnumber', 'rfnumber'];
const featureSearchId = 'features';
const leftCheckboxName = "left";
const rightCheckboxName = "right";

var lunrIndexFields = ['features'];
var sealionIndexReference = 'id';

//Create lunr index on page load
var searchIndex = createIndex();

// Search for sealions using firestore queries and lunr text search for features
async function searchExact() {
    clearOldSearchResults();
    var firebaseSearchResults = [];
    filters = await getFilterValues();
    results = await combineFeatureSearch(await getFirestoreMatches(filters));
    displaySealions(results).then(alert("Search complete"));
}

// Get sealions to display to webpage
function displaySealions(results) {
    return new Promise((resolve)=>{
        resolve(results.forEach(id => {
            db.collection("Sea Lions").doc(id).get().then(function(document) 
            {
                sealionsMap.set(document.id, document.data());
                createTable(document);
            });
            
        }));
    });
}

// Initialise map to match up the firebase properties to the form input fields
var formInputsToFirebase = new Map();
for (var i = 0; i < formInputIds.length; i++) {
    formInputsToFirebase.set(formInputIds[i], sealionIndexFields[i]);
}

// Cross checks firestore search results and feature search reuslts from lunr
// Returns only those that matched both
function combineFeatureSearch(existingMatches) {
    term = document.getElementById(featureSearchId).value;
    matches = [];
    return new Promise((resolve)=>{
        resolve(searchFeatures(term).then((ids)=>{
            ids.forEach((id)=>{
                if (existingMatches.includes(id)) {
                    matches.push(id);
                }
            });
            return matches;
        }));
    });
}

// Create filters for any non checkbox fields the user wants to filter on
function getFilterValues() {
    filters = [];
    formInputIdsExclCheckboxes.forEach(id=>{
        value = document.getElementById(id).value;
        if (value) {
            filter = createFilter(getFirebaseProperty(id), value);
            filters.push(filter);
        }
    });
    filters = filters.concat(getCheckboxFilters());
    return filters;
}

// Find the checkboxes that have been checked by the user and create filters for them
function getCheckboxFilters() {
    filters = [];
    checkboxes = nodelistToArray(document.getElementsByName(leftCheckboxName));
    checkboxes = checkboxes.concat(nodelistToArray(document.getElementsByName(rightCheckboxName)));
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            filters.push(createFilter(getFirebaseProperty(checkbox.id), true));
        }
    });
    return filters;
}

// Create a filter object for a native firebase query
function createFilter(prop, val) {
    var filter = {
        property: prop,
        comparison: '==',
        value: val
    };
    return filter;
}

// Returns the name of the firebase property that the passed input id refers to
function getFirebaseProperty(input_id) {
    return formInputsToFirebase.get(input_id);
}

// Accepts array of filter objects to apply as search
// Builds query by adding each filter and then executes
function getFirestoreMatches(filters) {
    return new Promise((resolve)=>{
        query = db.collection("Sea Lions");
        // Apply each filter to the query
        filters.forEach(filter => {
            query = applyFilter(query, filter)
        });
        //Retrieve the query data
        resolve(query.get().then(lions => {
            var lionIds = [];
            lions.forEach(lion => {
                lionIds.push(lion.id);
            });
            return lionIds;
        }));
    });
}

// Accepts collection (data set) to add filter to
function applyFilter(collection, filter) {
    return collection.where(filter.property, filter.comparison, filter.value);
}

function nodelistToArray(nodelist) {
    return Array.prototype.slice.call(nodelist);
}

// Remove any previous search results from webpage
function clearOldSearchResults() {
    document.getElementById("tbl_body").innerHTML = "";
}

// Search the index for any matches on the search term
function searchFeatures(term) {
    return new Promise((resolve)=>{
        resolve(searchIndex.then((idx)=>{
            result_ids = [];
            // Search the index with the search term
            results = idx.search(term);
            results.forEach((result)=>{
                // Add the ID of any matches to the results array
                result_ids.push(result.ref);
            });
            return result_ids;
        }));
    });
};

// Aquire all feature data from the database in JSON format
// Return only the feature description and the ID of the sealion it relates to
// Othe data does not need to be indexed
function getFeatures(){
    return new Promise((resolve)=>{
        var features = [];
        resolve(db.collection("Feature").get().then((docs)=>{
            docs.forEach(doc=>{
                var data = doc.data();
                features.push({sealionid:data.id, featureText:data.description});
            });
            return features;
        }));
    });
}

// Aquire all sealion data from the database in JSON format
function getSealions(){
    return new Promise((resolve)=>{
        var sealions = [];
        resolve(db.collection("Sea Lions").get().then((lions)=>{
            var sealions = [];
            lions.forEach((lion) => {
                lionJSON = lion.data();
                lionJSON.id = lion.id;
                sealions.push(lionJSON);
            });
            return sealions;
        }))
    });
}

// Merge the sealion data with the feature data
// Any sealion with a feature has the feature description added to it under 'features'
// Multiple features are concatenated as one string - does not matter for search purposes
async function combineSealionsWithFeatures(){
    features = await getFeatures();
    sealions = await getSealions();
    features.forEach((feature)=>{
        sealions.forEach((sealion)=>{
            // If the feature belongs with the current sealion
            if (feature.sealionid === sealion.id) {
                // If it is not the first feature, concatenate it with the existing features string
                if (sealion.features) {
                    sealion.features = sealion.features.concat(" ", feature.featureText);
                } else {
                    sealion.features = feature.featureText;
                }
            }
        });
    });
    return sealions;
}

// Use lunr to create the search index using the sealion data
function createIndex() {
    return new Promise((resolve)=>{
        var idx;
        resolve(combineSealionsWithFeatures().then((sealionDataToIndex)=>{
            idx = lunr(function () {
                // The identifier returned for any search matches
                this.ref(sealionIndexReference);
                // Index all fields in the lunrIndexFields array
                lunrIndexFields.forEach((field)=>{
                    this.field(field);
                })
                // Index the data for each sealion
                sealionDataToIndex.forEach(function (sealion) {
                    this.add(sealion)
                }, this)
            });
            return idx;
        }))
    });
}