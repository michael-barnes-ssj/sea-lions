var featureMax = 0;
var imageSrc = "";
var rowLength;

//Gets data from firestore and calls create card on each sea lion
function displaySeaLion()
{   
    db.collection("Sea Lions").get().then(function(document) 
    {        
        document.forEach(createTable);
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
    console.log(sealion.data());
    var tbl_body = document.getElementById("tbl_body");

    var tbl_row = document.createElement("tr");
    tbl_row.id = sealion.id;
    tbl_row.onclick = openModal(sealion.id);
    tbl_body.appendChild(tbl_row);

    var name = document.createElement("td").innerHTML = sealion.data()["name"];
    print (sealion.data()["name"]);
    var dob = document.createElement("td").innerHTML = sealion.data()["dob"];
    var trans = document.createElement("td").innerHTML = sealion.data()["transponder"];
    var status = document.createElement("td").innerHTML = sealion.data()["living_status"];
    var colour = document.createElement("td").innerHTML = sealion.data()["colour"];
    var type = document.createElement("td").innerHTML = sealion.data()["type"];
    var tag_num = document.createElement("td").innerHTML = sealion.data()["tag_number"];
    var rf_num = document.createElement("td").innerHTML = sealion.data()["rf_number"];

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
function createCard(sealion)
{ 
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

    //Details
    var name = document.createElement("p");
    var gender = document.createElement("p");
    var transponder = document.createElement("p");
    var dob = document.createElement("p");
    var mother = document.createElement("p");
    var pob = document.createElement("p");
    //Fill with field data
    name.innerHTML = cap("Name") + ": " + sealion.data()["name"];
    gender.innerHTML = cap("Gender") + ": " + sealion.data()["gender"];  
    transponder.innerHTML = cap("Transponder #") + sealion.data()["transponder"];  
    dob.innerHTML = cap("DOB") + ": " + sealion.data()["dob"];  
    mother.innerHTML = cap("Mother") + ": " + sealion.data()["mother"];
    pob.innerHTML = cap("POB") + ": " + sealion.data()["pob"];

    //Tag details
    var date_in = document.createElement("p");
    var type = document.createElement("p");
    //var desc = document.createElement("p");
    var tag_number = document.createElement("p");
    var rf_number = document.createElement("p");
    var left_out = document.createElement("p");
    var right_out = document.createElement("p");
    //Fill with field data
    date_in.innerHTML = cap("Tag Date In") + ": " + sealion.data()["tag_date_in"];
    type.innerHTML = cap("Type") + ": " + sealion.data()["type"];  
    //desc.innerHTML = cap("Transponder #") + sealion.data()["desc"];  
    tag_number.innerHTML = cap("Tag Number") + ": " + sealion.data()["tag_number"];  
    rf_number.innerHTML = cap("RFID Number") + ": " + sealion.data()["rf_number"];
    left_out.innerHTML = cap("Left Tag Out") + ": " + sealion.data()["left_tag_date_out"];  
    right_out.innerHTML = cap("Right Tag Out") + ": " + sealion.data()["right_tag_date_out"];
    
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
    for (var key in sealion.data()) 
    {
        if(sealion.data()[key] == true)
        {
            var fieldElement = document.createElement("p");
            //Fill with field data 
            fieldElement.innerHTML = cap(key) + ": Clipped";       
            //Append to appropriate column div
            //Column 3
            col3cell.appendChild(fieldElement);
        }
    }  

    //Gets all the features associated with sea lion. Updates inner html of element
    getFeatures(sealion.id, col4cell);
    
    var button = document.createElement('button');
    button.className = "button update";
    button.innerHTML = 'Update';
    button.onclick = function()
    {
        window.location='update.html';
    };
    col2cell.appendChild(button);    
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

function openModal(id){
	// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById(id);

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
}