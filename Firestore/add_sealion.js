//Holds the count of amount of features being added
var featureCount = -1;

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

function getFeatures()
{
    features = {size : featureCount+1, feature : []};
    //Only add image if they have added a feature
    if (featureCount > -1)
    {
        //Loop through all the features
        for (var featuresIndex = 0; featuresIndex <= featureCount;  featuresIndex++)
        {
            var descriptionElement = "featuredescription"+featuresIndex;                     
            features.feature.push({description : document.getElementById(descriptionElement).value, images : 0});            
        }
    }

    return features;
}

//uploads images and stores them under sea lions unique id
function uploadImage(id, currentFeature)
{
    //Only add image if they have added a feature
    if (featureCount > -1)
    {
        //Loop through all the features
        for (var featuresIndex = 0; featuresIndex <= featureCount;  featuresIndex++)
        {
            //Get the name of the array holding files
            var filesarray = "files"+featuresIndex+"[]";
            // Create a root reference
            var files = document.getElementById(filesarray).files; // use the Blob or File API
            
            //Only try and upload image if the files array has something in it
            if (files.length > 0)
            {
                //Update image length of data
                var refString = "sealion/"+id+"/features/feature/"+featuresIndex;
                var sealion = firebase.database().ref(refString);                
                sealion.update({ images: files.length });

                    //Loop through each image in files and add to firebase storage
                for (var imageIndex = 0; imageIndex < files.length; imageIndex++)
                {
                    var storageRef = firebase.storage().ref('features/' + id + "/feature" + featuresIndex + "/image" + imageIndex); 
                    var task = storageRef.put(files[imageIndex]);

                    // Register three observers:
                    // 1. 'state_changed' observer, called any time the state changes
                    // 2. Error observer, called on failure
                    // 3. Completion observer, called on successful completion
                    task.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                    }, function(error) {
                    // Handle unsuccessful uploads
                    console.log("Upload failed");            

                    }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    console.log("Upload completed");            
                    });
                }
            }                     
        }
    }
}

function getClippedArray(elementName)
{
    var clipped = [];
    var checked = document.getElementsByName(elementName);

    // Starts as true, if one is check becomes false
    var empty = true;
    
    for (var i = 0; i < checked.length; i++)
    {
        if (checked[i].checked)
        {
            clipped.push(checked[i].value);      
            empty = false;              
        }
    }
    // If still empty then push empty character
    if (empty)
    {
        clipped.push("-");

    }
    return clipped;
}

function addSeaLion()
{
    sealion = 
    {
        details: {
        name: checkIfEmpty(document.getElementById("name").value),
        mother: checkIfEmpty(document.getElementById("mother").value),
        dob: checkIfEmpty(document.getElementById("dob").value),
        pob:  checkIfEmpty(document.getElementById("pob").value),
        gender: checkIfEmpty(document.getElementById("gender").value),
        transponder: checkIfEmpty(document.getElementById("transponder").value)
        },
        tags: {
                date_in: checkIfEmpty(document.getElementById("tagdate").value),
                type: checkIfEmpty(document.getElementById("tagtype").value),
                description: checkIfEmpty(document.getElementById("tagdescription").value),
                number: checkIfEmpty(document.getElementById("tagnumber").value),
                rf_number: checkIfEmpty(document.getElementById("rfnumber").value),
                left_attached: "Yes",
                right_attached: "Yes"
        },
        toes: {

                clipped_left: getClippedArray("left[]"),
                clipped_right: getClippedArray("right[]")
        },
        features: getFeatures()        
    };

    db.collection("Sea Lions").add(sealion).then(function(docRef)
    {
        console.log("Document written with ID: ", docRef.id);
        uploadImage(docRef.id);

    }).catch(function(error) 
    {
        console.error("Error adding document: ", error);
    });     
}  

function checkIfEmpty(formdata)
{
    data = "-";
    if (formdata != "")
    {
        data = formdata;
    }
    return data;

}