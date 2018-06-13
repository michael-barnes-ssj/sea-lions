var featureCount = 0;
var currentSealionKey;

var featureIds = [];
var newFeature = false;

function createDom(domName, domType, labelText, sealion, cell)
{
    var input = document.createElement("input");
    var label = document.createElement("label");
    var text = document.createTextNode(labelText)
    input.setAttribute("type", domType);
    input.name = domName;
    input.id = domName;
    label.setAttribute("for", domName);
    label.appendChild(text);
    input.value = sealion[domName];
    cell.appendChild(label);  
    cell.appendChild(input);
}

function createSelectDom(domName, labelText, sealion, cell)
{
    var input = document.createElement("select");
    var label = document.createElement("label");
    var text = document.createTextNode(labelText)

    let selectOption = document.createElement("option");
    selectOption.value = sealion[domName]; 
    selectOption.text = sealion[domName];
    input.appendChild(selectOption);
    
    input.name = domName;
    input.id = domName;
    label.setAttribute("for", domName);
    label.appendChild(text);    
    cell.appendChild(label);  
    cell.appendChild(input);
    getList(domName);
}

function createUpdateCard(key)
{ 
    document.getElementById("displaySealions").innerHTML = "";
    // use sea lion id to get sea lion from map
    var sealion = sealionsMap.get(key);  
    currentSealionKey = key;      
    var containerDiv = document.createElement
    //Get ref to display div and create elements
    var displayDiv = document.getElementById("displaySealions");
    var grid = document.createElement("div");
    var card_container = document.createElement("div");
    grid.className = "grid-x grid-padding-x";
    card_container.className = "card";
    displayDiv.appendChild(card_container);
    card_container.appendChild(grid);

    var col1cell = document.createElement("div");
    var col2cell = document.createElement("div");
    var col3cell = document.createElement("div");
    var col4cell = document.createElement("div");
    col1cell.className = "large-3 medium-3 cell";
    col2cell.className = "large-3 medium-3 cell";
    col3cell.className = "large-3 medium-3 cell"; 
    col4cell.className = "large-3 medium-3 cell";   

    grid.appendChild(col1cell);
    grid.appendChild(col2cell);
    grid.appendChild(col3cell);
    grid.appendChild(col4cell);   

    //Create Name
    createDom("name", "text", "Name:", sealion, col1cell);

    //Create gender
    var gender = document.createElement("select");
    var genderLabel = document.createElement("label");
    var genderText = document.createTextNode("Gender:")
    gender.name = "gender";
    gender.id = "gender";
    genderLabel.setAttribute("for", "gender");
    genderLabel.appendChild(genderText);

    let genderOption = document.createElement("option");
    genderOption.value = sealion[gender]; 
    genderOption.text = sealion[gender];
    gender.appendChild(genderOption);
    
	var array = ["Male","Female"];

    //Create and append the options
    for (var i = 0; i < array.length; i++) 
    {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        gender.appendChild(option);
    } 

    col1cell.appendChild(genderLabel);  
    col1cell.appendChild(gender); 

    //Create living status
    var living = document.createElement("select");
    var livingLabel = document.createElement("label");
    var livingText = document.createTextNode("Living Status:")
    living.name = "living_status";
    living.id = "living_status";
    livingLabel.setAttribute("for", "living_status");
    livingLabel.appendChild(livingText);

    let livingOption = document.createElement("option");
    livingOption.value = sealion["living_status"]; 
    livingOption.text = sealion["living_status"];
    living.appendChild(livingOption);
    
	var statusarray = ["Alive","Dead"];

    //Create and append the options
    for (var i = 0; i < statusarray.length; i++) 
    {
        var option = document.createElement("option");
        option.value = statusarray[i];
        option.text = statusarray[i];
        living.appendChild(option);
    } 

    col1cell.appendChild(livingLabel);  
    col1cell.appendChild(living);

    createDom("transponder", "text", "Transponder:", sealion, col1cell);
    createDom("dob", "date", "DOB:", sealion, col1cell);
   
    //Create mother
    var mother = document.createElement("select");
    var motherLabel = document.createElement("label");
    var motherText = document.createTextNode("Mother:")
    mother.id = "mother";
    mother.name = "mother";
    motherLabel.setAttribute("for", "mother");

    let motherOption = document.createElement("option");
    motherOption.value = sealion["mother"]; 
    motherOption.text = sealion["mother"];
    mother.appendChild(motherOption);


    motherLabel.appendChild(motherText);
    col1cell.appendChild(motherLabel);  
    col1cell.appendChild(mother); 
    

    getMothers();

    createSelectDom("pob", "POB:", sealion, col1cell);      
    createDom("tag_date_in", "date", "Tag Date in:", sealion, col2cell);
    createSelectDom("tagtype", "Tag Type:", sealion, col2cell);  
    createSelectDom("tagcolour", "Tag Colour:", sealion, col2cell);  
    createDom("tag_number", "text", "Tag Number:", sealion, col2cell);
    createDom("rf_number", "text", "Tag Number:", sealion, col2cell);
    createDom("left_tag_date_out", "date", "Left Out:", sealion, col2cell);
    createDom("right_tag_date_out", "date", "Right Out:", sealion, col2cell);  
   
    var clipped_title = document.createElement("p");
    clipped_title.innerHTML = "Clipped toes:";
    col3cell.appendChild(clipped_title);

    var leftTitle = document.createElement("p");
    leftTitle.innerHTML = "Left Clipped:";
    col3cell.appendChild(leftTitle);
    
    var leftkeys = ["left1", "left2", "left3", "left4", "left5"];
    var rightkeys = ["right1", "right2", "right3", "right4", "right5"];
    
    for (var i = 0; i < leftkeys.length; i++)
    {        
        if(sealion[leftkeys[i]] == true)
        {            
            createCheckbox(i+1, leftkeys[i], "left", 1, true, col3cell );
        }
        else if (sealion[leftkeys[i]] == false)
        {
            createCheckbox(i+1, leftkeys[i], "left", 1, false, col3cell );
        }
    }

    var rightClipped = document.createElement("p");
    rightClipped.className = "right-clipped";
    rightClipped.innerHTML = "Right Clipped:";
    col3cell.appendChild(rightClipped);

    for (var i = 0; i < rightkeys.length; i++)
    {
        
        if(sealion[rightkeys[i]] == true)
        {
            
            createCheckbox(i+1, rightkeys[i], "right", 1, true, col3cell );
        }
        else if (sealion[rightkeys[i]] == false)
        {
            createCheckbox(i+1, rightkeys[i], "right", 1, false, col3cell );
        }
    }

     //Create features title  
    var title = document.createElement("p");
    title.innerHTML = "Features:";
    col4cell.appendChild(title);
    
    //Gets all the features associated with sea lion. Updates inner html of element
    getFeaturesForEdit(key, col4cell);    

    // Add feature button
    let addFeature = document.createElement("button");
    addFeature.className = "button feature";
    addFeature.innerHTML = 'Add Feature';
    addFeature.onclick = createFeaturesForEdit;    
    col4cell.appendChild(addFeature);
    
    //create button
    let button = document.createElement('button');
    button.className = "button update";
    button.innerHTML = 'Submit';
    button.onclick = updateSealion;  
    button.onclick = updateFeatues;  
    col1cell.appendChild(button); 

    // Add div to put new features in
    let featureDiv = document.createElement("div");
    featureDiv.id = "features";
    col4cell.appendChild(featureDiv);   
}


function createCheckbox(num, id, name, value, checked, cell)
{   
    var checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.name = name;
    checkbox.id = id;

    checkbox.value = value;
    checkbox.checked = checked;
    checkbox.className = "toe-check";

    let label = document.createElement('label');
    label.className = "toe-label update";
    label.setAttribute("for", id);
    label.innerHTML = num



    
    cell.appendChild(checkbox);
    cell.appendChild(label);
}

function createFeaturesForEdit()
{      
    newFeature = true;
    

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
    
    featureCount++;
}

// Takes in sea lion id, searches features with that id. Fills passed in element with features string
function getFeaturesForEdit(id, div)
{     
    db.collection("Feature").where("id", "==", id).get().then(function(querySnapshot) 
    {           
        // Go through each feature and create desciption element
        querySnapshot.forEach(function(doc) 
        {  
            featureIds.push(doc.id);
            var featureElement = document.createElement("input");
            featureElement.setAttribute("type", "text");
            featureElement.id = doc.id;
            featureElement.value = doc.data().description;
            div.appendChild(featureElement);

            // For each image the feature has, create element and fill it with image
            for (var i = 0; i < doc.data().images; i++)
            {
                var img = document.createElement("img");
                img.className = "smallImage";
                img.id = "image"+doc.id;
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

function isChecked(name, index)
{
    let checked = false;
    let cb = document.getElementsByName(name)[index];
    console.log(cb.checked);
    if (cb.checked)
    {
        checked = true;
    }
    console.log(checked);
    return checked;
}

function updateFeatues()
{
    if (newFeature)
    {
        addFeaturesForEdit(currentSealionKey);
    }


    for (let i = 0; i < featureIds.length; i++)
    {
        console.log(featureIds[i]);
        var featureRef = db.collection("Feature").doc(featureIds[i]);

        featureRef.update
        (
            {
                description : document.getElementById(featureIds[i]).value
            }
            
        )
        .then(function() {
            console.log("Document successfully updated!");
            if (i == featureIds.length-1)
            {
                location.reload();
            }
            
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);

    });

    }

    

}




function updateSealion()
{
    var sealionRef = db.collection("Sea Lions").doc(currentSealionKey);    

    var sealionUpdatedData = 
    {        
        name: document.getElementById("name").value,
        transponder: document.getElementById("transponder").value,   
        mother: document.getElementById("mother").value,
        dob: document.getElementById("dob").value,
        pob:  document.getElementById("pob").value,
        gender: document.getElementById("gender").value,        
        living_status: document.getElementById("living_status").value,   
		tag_date_in: document.getElementById("tag_date_in").value,
        left_tag_date_out: document.getElementById("left_tag_date_out").value,
        right_tag_date_out: document.getElementById("right_tag_date_out").value,
		type: document.getElementById("tagtype").value,
        colour: document.getElementById("tagcolour").value,		
		tag_number: document.getElementById("tag_number").value,
		rf_number: document.getElementById("rf_number").value,		
		left1: isChecked("left", 0),
		left2: isChecked("left", 1),
		left3: isChecked("left", 2),
		left4: isChecked("left", 3),
		left5: isChecked("left", 4),
		right1: isChecked("right", 0),
		right2: isChecked("right", 1),
		right3: isChecked("right", 2),
		right4: isChecked("right", 3),
		right5: isChecked("right", 4),   
            
    };

    // Set the "capital" field of the city 'DC'
    return sealionRef.update
    (
        sealionUpdatedData
    )
    .then(function() {
        console.log("Document successfully updated!");
    
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);

    });
}

function addFeaturesForEdit(id)
{    
          
    //Loop through all the features
    for (var featuresIndex = 0; featuresIndex < featureCount;  featuresIndex++)
    {            
        var descriptionElement = "featuredescription"+featuresIndex;                     
        feature_object = {description : document.getElementById(descriptionElement).value, images : 0, id : id};   

        db.collection("Feature").add(feature_object).then(function(feature)
        {
            console.log("Document written with ID: ", feature.id);                
            //uploadImageForEdit(feature.id);

        }).catch(function(error) 
        {
            console.error("Error adding document: ", error);
        });          
    }
       
}

//uploads images and stores them under sea lions unique id
function uploadImageForEdit(id)
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