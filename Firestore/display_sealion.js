var featureMax = 0;
var imageSrc = "";
var rowLength;
var featureCount = 0;

var sealionsMap = new Map;

//Gets data from firestore and calls create card on each sea lion
function displaySeaLionTbl()
{   
    db.collection("Sea Lions").get().then(function(document) 
    {        
        // Store each sea lion in a map to refer to later
        document.forEach(function(data)
        {
            sealionsMap.set(data.id, data.data());
        });

        document.forEach(createTable);        
    }); 
}
function displaySeaLion()
{   
    db.collection("Sea Lions").get().then(function(document) 
    {        
        document.forEach(createCard);
        console.log(document);
    }); 
}

// Takes a string and makes first letter upper case and replaces _ with a space
function cap(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");    
}

function createTable(sealion)
{
    var sl = sealion.data();
    
    var tbl_body = document.getElementById("tbl_body");

    var tbl_row = document.createElement("tr");    
    tbl_body.appendChild(tbl_row);

    tbl_row.id = sealion.id;
    tbl_row.onclick = openModal;
    
    var name = document.createElement("td");
    name.innerHTML = sl.name;    
    var dob = document.createElement("td");
    dob.innerHTML = sl.dob;
    var trans = document.createElement("td");
    trans.innerHTML = sl.transponder;
    var status = document.createElement("td");
    status.innerHTML = sl.living_status;
    var colour = document.createElement("td");
    colour.innerHTML = sl.colour;
    var type = document.createElement("td");
    type.innerHTML = sl.type;
    var tag_num = document.createElement("td");
    tag_num.innerHTML = sl.tag_number;
    var rf_num = document.createElement("td");
    rf_num.innerHTML = sl.rf_number;
    
    tbl_row.appendChild(name);
    tbl_row.appendChild(dob);
    tbl_row.appendChild(trans);
    tbl_row.appendChild(status);
    tbl_row.appendChild(colour);
    tbl_row.appendChild(type);
    tbl_row.appendChild(tag_num);
    tbl_row.appendChild(rf_num);
}

// Take passed in sea lion object and iterates through creating html elements and diplays to screen.
function createCard(key)
{ 
    // use sea lion id to get sea lion from map
    var sealion = sealionsMap.get(key);
    

    var containerDiv = document.createElement
    //Get ref to display div and create elements
    var displayDiv = document.getElementById("displaySealions");
    displayDiv.innerHTML = "";

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
    col4cell.className = "large-3 medium-3 cell col4";   

    grid.appendChild(col1cell);
    grid.appendChild(col2cell);
    grid.appendChild(col3cell);
    grid.appendChild(col4cell);

    //Creating elements for each variable for the sea lion

    //Details
    var name = document.createElement("p");
    var gender = document.createElement("p");
    var transponder = document.createElement("p");
    var dob = document.createElement("p");
    var mother = document.createElement("p");
    var pob = document.createElement("p");
    //Fill with field data
    name.innerHTML = cap("Name") + ": " + sealion["name"];
    gender.innerHTML = cap("Gender") + ": " + sealion["gender"];  
    transponder.innerHTML = cap("Transponder #") + sealion["transponder"];  
    dob.innerHTML = cap("DOB") + ": " + sealion["dob"];  
    mother.innerHTML = cap("Mother") + ": " + sealion["mother"];
    pob.innerHTML = cap("POB") + ": " + sealion["pob"];

    //Tag details
    var date_in = document.createElement("p");
    var type = document.createElement("p");
    //var desc = document.createElement("p");
    var tag_number = document.createElement("p");
    var rf_number = document.createElement("p");
    var left_out = document.createElement("p");
    var right_out = document.createElement("p");
    //Fill with field data
    date_in.innerHTML = cap("Tag Date In") + ": " + sealion["tag_date_in"];
    type.innerHTML = cap("Type") + ": " + sealion["type"];  
    //desc.innerHTML = cap("Transponder #") + sealion.data()["desc"];  
    tag_number.innerHTML = cap("Tag Number") + ": " + sealion["tag_number"];  
    rf_number.innerHTML = cap("RFID Number") + ": " + sealion["rf_number"];
    left_out.innerHTML = cap("Left Tag Out") + ": " + sealion["left_tag_date_out"];  
    right_out.innerHTML = cap("Right Tag Out") + ": " + sealion["right_tag_date_out"];
    
    //Append to appropriate column div
    //Column 1
    col1cell.appendChild(name);
    col1cell.appendChild(gender);
    col1cell.appendChild(transponder);
    col1cell.appendChild(dob);
    col1cell.appendChild(mother);
    col1cell.appendChild(pob);
    //Column 2
    col2cell.appendChild(date_in);
    col2cell.appendChild(type);
    col2cell.appendChild(tag_number);
    col2cell.appendChild(rf_number);
    col2cell.appendChild(left_out);
    col2cell.appendChild(right_out);

    //Loop through each key and if it equals true, print out the variable.
    //This way only clipped toes are shown.
    var clipped_title = document.createElement("p");
    clipped_title.innerHTML = "Clipped toes:";
    col3cell.appendChild(clipped_title);


    for (let key in sealion) 
    {
        if(sealion[key] == true)
        {
            var fieldElement = document.createElement("p");
            //Fill with field data 
            fieldElement.innerHTML = cap(key) + ": Clipped";       
            //Append to appropriate column div
            //Column 3
            col3cell.appendChild(fieldElement);
        }
    }  
    	
    var button_div = document.createElement("div");
    button_div.className = "button_div";
    grid.appendChild(button_div);

    //Gets all the features associated with sea lion. Updates inner html of element
    getFeatures(key, col4cell);
    
    var button = document.createElement('button');
    button.className = "button  submit_update";
    button.innerHTML = 'Update';
    button.onclick = function()
    {
       updateSealion(key);
    };
    button_div.appendChild(button);    

    var button = document.createElement('button');
     button.className = "button delete";
    button.innerHTML = 'Delete';
    button.onclick = function()
    {
        deleteSealion(key);
    };
    button_div.appendChild(button);  
}

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
    // use sea lion id to get sea lion from map
    var sealion = sealionsMap.get(key);    
    
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

    //Creating elements for each variable for the sea lion

    //Create Name
    createDom("name", "text", "Name:", sealion, col1cell);

    //Create gender
    var gender = document.createElement("select");
    var genderLabel = document.createElement("label");
    var genderText = document.createTextNode("Gender:")
    gender.name = "gender";
    genderLabel.setAttribute("for", "gender");
    genderLabel.appendChild(genderText);
    
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

    createDom("transponder", "text", "Transponder:", sealion, col1cell);
    createDom("dob", "date", "DOB:", sealion, col1cell);
   
    //Create mother
    var mother = document.createElement("select");
    var motherLabel = document.createElement("label");
    var motherText = document.createTextNode("Mother:")
    mother.id = "mother";
    mother.name = "mother";
    motherLabel.setAttribute("for", "mother");
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
        console.log(sealion["leftone"]);
        if(sealion[leftkeys[i]] == true)
        {
            console.log(sealion[leftkeys[i]]);
            createCheckbox(leftkeys[i], leftkeys[i], 1, true, col3cell );
        }
        else if (sealion[leftkeys[i]] == false)
        {
            createCheckbox(leftkeys[i], leftkeys[i], 1, false, col3cell );
        }
    }

    var rightClipped = document.createElement("p");
    rightClipped.innerHTML = "Right Clipped:";
    col3cell.appendChild(rightClipped);

    for (var i = 0; i < rightkeys.length; i++)
    {
        console.log(sealion["leftone"]);
        if(sealion[rightkeys[i]] == true)
        {
            console.log(sealion[rightkeys[i]]);
            createCheckbox(rightkeys[i], rightkeys[i], 1, true, col3cell );
        }
        else if (sealion[rightkeys[i]] == false)
        {
            createCheckbox(rightkeys[i], rightkeys[i], 1, false, col3cell );
        }
    }

     //Create features title  
    var title = document.createElement("p");
    title.innerHTML = "Features:";
    col4cell.appendChild(title);
    
    //Gets all the features associated with sea lion. Updates inner html of element
    getFeaturesForEdit(key, col4cell);    

    

    let addFeature = document.createElement("button");
    addFeature.className = "button feature";
    addFeature.innerHTML = 'Add Feature';
    addFeature.onclick = createFeaturesForEdit;

    console.log(addFeature)
    col4cell.appendChild(addFeature);
    	
    var button_div = document.createElement("div");
    button_div.className = "button_div";
    grid.appendChild(button_div);
    
    let button = document.createElement('button');
    button.className = "button submit_update";
    button.innerHTML = 'Submit';
    button.onclick = function()
    {
        updateSealion(key);
    };
    button_div.appendChild(button); 

    let featureDiv = document.createElement("div");
    featureDiv.id = "features";
    col4cell.appendChild(featureDiv);   

   
}


function createCheckbox(id, name, value, checked, cell)
{   
    var checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.name = name;
    checkbox.value = value;
    checkbox.checked = checked;
    cell.appendChild(checkbox);

}

function deleteSealion(key)
{
    db.collection("Sea Lions").doc(key).delete().then(function() {
    console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function updateSealion(key)
{
    document.getElementById("displaySealions").innerHTML = "";
    createUpdateCard(key)
}

function createFeaturesForEdit()
{      
    featureCount = -1;

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
            console.log(doc.data());
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

// Takes in sea lion id, searches features with that id. Fills passed in element with features string
function getFeaturesForEdit(id, div)
{ 
    
    db.collection("Feature").where("id", "==", id).get().then(function(querySnapshot) 
    {   
        
        // Go through each feature and create desciption element
        querySnapshot.forEach(function(doc) 
        {        
            featureCount++;               
            var featureElement = document.createElement("input");
            featureElement.setAttribute("type", "text");
            featureElement.value = doc.data().description;
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


function openModal(id)
{
    //Get sea lion id by getting id of parent of click - same as sealion
    sealionID = id.target.parentElement.id;
	// Get the modal
    var modal = document.getElementById('myModal');  
    
    modal.style.display = "block";
    createCard(sealionID);

    var span = document.getElementsByClassName("close")[0]; 

    //When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}




