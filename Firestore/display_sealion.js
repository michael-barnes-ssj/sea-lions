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
    getFeatures(sealion.id, sealionDiv);  
    // Add element to sea lion div
     
}

// Takes in sea lion id, searches features with that id. Fills passed in element with features string
function getFeatures(id, div)
{ 
    db.collection("Feature").where("id", "==", id).get().then(function(querySnapshot) 
    {   
        //Create features title 
        var title = document.createElement("p");
        title.innerHTML = "Features:";
        div.appendChild(title);    

        // Go through each feature and create desciption element
        querySnapshot.forEach(function(doc) 
        {            
            var featureElement = document.createElement("p");
            featureElement.innerHTML = doc.data().description;
            div.appendChild(featureElement);

            // For each image the feature has, create element and fill it with image
            for (var i = 0; i < doc.data().images; i++)
            {
                var img = document.createElement("img");
                img.className = "smallImage";
                getImage(doc.id, i, img);
                div.appendChild(img);                
            } 
        }); 
    })
    .catch(function(error) 
    {
        console.log("Error getting documents: ", error);
    });
}

function getImage(id, index, element)
{    
    var imageRef = id+"/image"+index; 
	
    firebase.storage().ref().child(imageRef).getDownloadURL().then(function(url)
    {        
        element.src = url;        
    });
}
    
    

    









