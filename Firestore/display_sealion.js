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

    //Get ref to display div and create elements
    var displayDiv = document.getElementById("displaySealions");
    var sealionDiv = document.createElement("div");
    var title = document.createElement("h3");

    title.innerHTML = sealion.details.name;
    sealionDiv.className = "sealionDiv";
    
    sealionDiv.appendChild(title);
    displayDiv.appendChild(sealionDiv);
    
    //Loop through each set on info
    for (var infoKey in sealion) 
    {
        //Create elements
        var infoDiv = document.createElement("div");
        var infoTitle = document.createElement("h4");

        infoDiv.className = "pure-u-1-4 infoDiv";
        infoTitle.innerHTML = cap(infoKey);    
        infoDiv.appendChild(infoTitle);
        sealionDiv.appendChild(infoDiv);
        
        //Loop through each field and add to html
        for (var key in sealion[infoKey])
        {
            var field = sealion[infoKey][key]; 
            var fieldElement = document.createElement("p"); 
            
            //If not a feature add normally
            if (key != "feature")
            {                                  
                fieldElement.innerHTML = cap(key) + ": " + field;
                infoDiv.appendChild(fieldElement);
            }
            //If a feature create a concatenated string of all features
            else
            {
                var featureString = "";
                
                for (var featureIndex in sealion[infoKey][key])
                {
                    featureString += field[featureIndex].description +", ";
                }

                fieldElement.innerHTML = featureString.slice(0,-2);
                infoDiv.appendChild(fieldElement);
            }   
        }
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
    
    

    









