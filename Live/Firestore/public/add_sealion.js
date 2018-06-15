//Holds the count of amount of features being added
var featureCount = -1;
// Using global variable to increament file array number. This is caused by async errors
var fileArrayIndex = 0;

//Creates html to upload features
function createFeatures()
{      
    featureCount++;

    var form = document.createElement('form');    
    var field = document.createElement('fieldset');
    var label = document.createElement('label');
    var textarea = document.createElement('textarea');          
    var input=document.createElement('input');
    var div = document.getElementById("features");

    label.htmlFor = "featuredescription"+featureCount;
    label.innerHTML = "Description: ";
    form.className= "pure-form pure-form-stacked";
    textarea.id = "featuredescription"+featureCount; 
    input.type="file";
    input.multiple = true;
    input.id = "files"+featureCount+"[]";

    form.appendChild(field);
    field.appendChild(label);
    field.appendChild(textarea);
    field.appendChild(input);    
    div.appendChild(form);    
}

function addFeatures(id)
{   
    return new Promise((resolve)=>{
        //Only add image if they have added a feature
        if (featureCount > -1)
        {        
            //Loop through all the features
            for (var featuresIndex = 0; featuresIndex <= featureCount;  featuresIndex++)
            {            
                var descriptionElement = "featuredescription"+featuresIndex;                     
                feature_object = {description : document.getElementById(descriptionElement).value, images : 0, index : featuresIndex, id : id};   

                db.collection("Feature").add(feature_object).then(function(feature)
                {
                    console.log("Document written with ID: ", feature.id);                
                    uploadImage(feature.id);

                }).catch(function(error) 
                {
                    console.error("Error adding document: ", error);
                });          
            }
        }
    });
}

//uploads images and stores them under sea lions unique id
function uploadImage(id)
{        
    //Get the name of the array holding files
    var filesarray = "files"+fileArrayIndex+"[]";

    console.log(filesarray);
    // Create a root reference
    var files = document.getElementById(filesarray).files; // use the Blob or File API
    console.log(files);
    
    //Only try and upload image if the files array has something in it
    if (files.length > 0)
    {  
        console.log("file length: " + files.length);
        //Update image length of data            

        var featureRef = db.collection("Feature").doc(id);            
        featureRef.update({
            images: files.length
        });

        //Loop through each image in files and add to firebase storage
        for (var imageIndex = 0; imageIndex < files.length; imageIndex++)
        {
            var storageRef = firebase.storage().ref(id + "/image" + imageIndex); 
            var task = storageRef.put(files[imageIndex]);

            //Add error handling - See firebase docs
        }
    }     
    fileArrayIndex++;             
       
}

function getClipped(elementName)
{
    var clipped = [];
    var checked = document.getElementsByName(elementName);    
    
    for (var i = 0; i < checked.length; i++)
    {
        if (checked[i].checked)
        {
            clipped.push(true);      
            empty = false;              
        }
		else
		{
			clipped.push(false);  
		}
    }   
	
    return clipped;
}

function strToBoolOrEmpty(val) {
    converted = '';
    if (val === 'true') {converted = true}
    else if (val === 'false') {converted = false}
    return converted;
}

function addSeaLion()
{	
	left = getClipped("left[]");
	right = getClipped("right[]");	
	
    sealion = 
    {        
        name: checkIfEmpty(document.getElementById("name").value),
        mother: checkIfEmpty(document.getElementById("mother").value),
        dob: checkIfEmpty(document.getElementById("dob").value),
        pob:  checkIfEmpty(document.getElementById("pob").value),
        gender: checkIfEmpty(document.getElementById("gender").value),
        transponder: checkIfEmpty(document.getElementById("transponder").value),   
        living_status: checkIfEmpty(document.getElementById("living_status").value),   
		tag_date_in: checkIfEmpty(document.getElementById("tagdatein").value),
        left_tag_out: strToBoolOrEmpty(checkIfEmpty(document.getElementById("lefttagout").value)),
        right_tag_out: strToBoolOrEmpty(checkIfEmpty(document.getElementById("righttagout").value)),
		type: checkIfEmpty(document.getElementById("tagtype").value),
        colour: checkIfEmpty(document.getElementById("tagcolour").value),		
		tag_number: checkIfEmpty(document.getElementById("tagnumber").value),
		rf_number: checkIfEmpty(document.getElementById("rfnumber").value),		
		left1: left[0],
		left2: left[1],
		left3: left[2],
		left4: left[3],
		left5: left[4],
		right1: right[0],
		right2: right[1],
		right3: right[2],
		right4: right[3],
		right5: right[4],           
            
    };		

    db.collection("Sea Lions").add(sealion).then(function(sealion)
    {
        console.log("Document written with ID: ", sealion.id);
        addFeatures(sealion.id).then(alert("Sealion added successfully"));        

    }).catch(function(error) 
    {
        console.error("Error adding document: ", error);
    });     
}   

function checkIfEmpty(formdata)
{
    // data = "-";
    // if (formdata != "")
    // {
    //     data = formdata;
    // }
    return formdata;
}