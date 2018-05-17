const filterObj = {
    property: '',
    comparison: '==',
    value: ''
}

// Accepts array of filter objects to apply as search
// Builds query by adding each filter and then executes
function search() {
    filters = makeFilters(); //To be replaced with parameter
    query = db.collection("Sea Lions");
    // Apply each filter to the query
    filters.forEach(filter => {
        query = applyFilter(query, filter)
    });
    //Retrieve the query data
    query.get().then(lions => {
        lions.forEach(lion => {
            console.log(lion.id, lion.data());
        });
    });
}

// Accepts collection (data set) to add filter to
function applyFilter(collection, filter) {
    return collection.where(filter.property, filter.comparison, filter.value);
}

// Just to provide dummy filter objects for testing
function makeFilters() {
    filterA = Object.create(filterObj);
    filterB = Object.create(filterObj);
    filterA.property = 'gender';
    filterA.value = 'Male'
    filterB.property = 'left1';
    filterB.value = false;
    return [filterA, filterB];
}