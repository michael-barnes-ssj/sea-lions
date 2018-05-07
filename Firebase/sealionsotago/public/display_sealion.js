var featureMax = 0;
var imageSrc = "";
var rowLength;

function displaySeaLion()
{             
    //get ref to database
    var data = firebase.database();        

    //Get reference to body of table that displays sealions
    var displayBody = document.getElementById("displayBody");
    //Remove all current data
    displayBody.innerHTML = '';

    //Takes sizes of objects in databases and sets colspan dynamically
    data.ref("sealion/").orderByChild("features/size").limitToLast(1).on("child_added", sizeTable);                  
    
    //get snapshot of database. Calls get data function
    data.ref().child("sealion").on("value", getData);
}  


function getData(data)
{
    //Go through each sea lion and append to table
    data.forEach(function(sealion)
    {                    
        var row = displayBody.insertRow();

        //Details
        var name = row.insertCell();
        var DOB = row.insertCell();
        var POB = row.insertCell();
        var mother = row.insertCell();
        var gender = row.insertCell();
        var transponder = row.insertCell();

        name.innerHTML = sealion.val().details.name;
        DOB.innerHTML = sealion.val().details.dob;
        POB.innerHTML = sealion.val().details.pob;
        mother.innerHTML = sealion.val().details.mother;
        gender.innerHTML = sealion.val().details.gender; 
        transponder.innerHTML = sealion.val().details.transponder; 
        
        //Tags
        var date_in = row.insertCell();
        var type = row.insertCell();
        var description = row.insertCell();
        var number = row.insertCell();
        var rf_number = row.insertCell();
        var left_attached = row.insertCell();
        var right_attached = row.insertCell(); 
        
        date_in.innerHTML = sealion.val().tags.date_in;
        type.innerHTML = sealion.val().tags.type;
        description.innerHTML = sealion.val().tags.description;
        number.innerHTML = sealion.val().tags.number;
        rf_number.innerHTML = sealion.val().tags.rf_number; 
        left_attached.innerHTML = sealion.val().tags.left_attached; 
        right_attached.innerHTML = sealion.val().tags.right_attached; 

        //toes
        var left = row.insertCell();
        var right = row.insertCell();  

        left.innerHTML = sealion.val().toes.clipped_left;
        right.innerHTML = sealion.val().toes.clipped_right;

        //features 
        
        if (sealion.val().features.size > 0)
        {
            //Go through every cell and fill with description or empty
            for (var i = 0; i < featureMax ; i++)
            {
                //If they have feature create cell and fill it
                if (sealion.val().features.feature[i])
                {
                    row.insertCell().innerHTML = sealion.val().features.feature[i].description;   
                    console.log("Feature: " + i + "Description:" + sealion.val().features.feature[i].description);

                    console.log("Feature: " + i + "Image count:" + sealion.val().features.feature[i].images);
                    var imagesLength = sealion.val().features.feature[i].images;                    
                    
                    //If they have an image
                    if (imagesLength > 0)
                    {
                        var cell = row.insertCell();
                        //Display each image
                        for (var j = 0; j < imagesLength; j++ )
                        {
                            var img = document.createElement("IMG");
                            img.id = sealion.key+i+j;
                            img.className = "smallImage";
                            cell.appendChild(img);  
                            getImage(sealion.key, i, j);                        
                        }                                    
                    }
                    else
                    {
                        row.insertCell().innerHTML = "";
                    }                    
                } 
                else
                {
                    row.insertCell().innerHTML = "";       
                    row.insertCell().innerHTML = "";              
                }
            }                 
        }
        else // They don't have any features so draw null
        {
            for (var i = 0; i < featureMax; i++)
            {                                  
                row.insertCell().innerHTML = "";
                //pic goes here
                row.insertCell().innerHTML ="";
            } 
        }        
    });
}

function sizeTable(data)
{
    var diff = 0;    
    
    //Calcularte how many rows to ad to table on add
    if (featureMax < data.val().features.size)
    {          
        diff = data.val().features.size - featureMax;   
        featureMax = data.val().features.size;
    }

    //Take first sealion in database and get length of inner objects and assign to table    
    document.getElementById("featuretitle").colSpan = featureMax*2;        
    document.getElementById("details").colSpan = Object.keys(data.val().details).length;
    document.getElementById("tags").colSpan = Object.keys(data.val().tags).length;
    document.getElementById("toes").colSpan = Object.keys(data.val().toes).length;

    //Add rows to table
    for (var i = 0; i < diff; i++)
    {
        document.getElementById("titles").insertCell().outerHTML = "<th>Description</th>";  
        document.getElementById("titles").insertCell().outerHTML = "<th>Images</th>";                
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
    
    

    









