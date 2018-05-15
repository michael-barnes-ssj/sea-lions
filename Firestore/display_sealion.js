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
function createCard(data)
{
    var sealion = data.data();

    console.log(sealion.name);
    //Get ref to display div and create elements
    var displayDiv = document.getElementById("displaySealions");
    var sealionDiv = document.createElement("div");
    var title = document.createElement("h3");

    title.innerHTML = sealion.name;
    sealionDiv.className = "sealionDiv";
    
    sealionDiv.appendChild(title);
    displayDiv.appendChild(sealionDiv);
    
    //Loop through each sealion and display data
    for (var infoKey in sealion) 
    {
        console.log(infoKey + ": " + sealion[infoKey]);

        var infoDiv = document.createElement("div");
        var fieldElement = document.createElement("p"); 
        fieldElement.innerHTML = cap(infoKey) + ": " + sealion[infoKey];
        infoDiv.appendChild(fieldElement);
        sealionDiv.appendChild(infoDiv);       
    }    
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
    
    

    









