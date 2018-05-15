var featureMax = 0;
var imageSrc = "";
var rowLength;


//Gets data from firestore and calls create card on each sea lion
function displaySeaLion()
{    
    db.collection("Sea Lions").get().then(function(document) 
    {        
        document.forEach(createCard);
    });  
}  

// Takes a string and makes first letter upper case and replaces _ with a space
function cap(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");    
}

// Take passed in sea lion object and iterates through creating html elements and diplays to screen.
function createCard(sealion)
{ 
    //Get ref to display div and create elements
    var displayDiv = document.getElementById("displaySealions");
    var sealionDiv = document.createElement("div");    
    var featureElement = document.createElement("p");
    
    sealionDiv.className = "sealionDiv";  
    
    displayDiv.appendChild(sealionDiv);

    //Loop through each sealion and display data
    for (var key in sealion.data()) 
    {        
        //Create element
        var fieldElement = document.createElement("p");
        //Fill with field data 
        fieldElement.innerHTML = cap(key) + ": " + sealion.data()[key];       
        //Append to sealion div
        sealionDiv.appendChild(fieldElement);
    }   

    //Gets all the features associated with sea lion. Updates inner html of element
    getFeatures(sealion.id, featureElement);  
    // Add element to sea lion div
    sealionDiv.appendChild(featureElement);  
}

// Takes in sea lion id, searches features with that id. Fills passed in element with features string
function getFeatures(id, element)
{ 
    db.collection("Feature").where("id", "==", id).get().then(function(querySnapshot) 
    {
        var features = "";

        querySnapshot.forEach(function(doc) 
        {
            features += doc.data().description + ", ";
        }); 
        
        element.innerHTML = "Features: " + features.slice(0,-2);
    })
    .catch(function(error) 
    {
        console.log("Error getting documents: ", error);
    });
}

function getImage(key, featureIndex, imageIndex)
{    
    var imageRef = "features/"+key+"/feature"+featureIndex+"/image"+imageIndex; 
	
    firebase.storage().ref().child(imageRef).getDownloadURL().then(function(url)
    {
        var ref = key+featureIndex+imageIndex;
        var imgRef = document.getElementById(ref);
        imgRef.src = url;        
    });
}
    
    

    









