function fillDropdowns()
{
	getList("gender");
	getList("tagcolour");
	getList("tagtype");
	getMothers();
}

function getMothers()
{
	db.collection("Sea Lions").get().then(function(document) 
    {  
		document.forEach(function(values)
		{			
			console.log(values.data());
			addOptionToDropDown(values.data().name, "mother");					
		});
	});
}

function getList(dropdownName)
{
	db.collection(dropdownName).get().then(function(document) 
    {        
        document.forEach(function(values)
		{
			start(values.data(), dropdownName);					
		});
    }); 
}

function start(data, dropdownName)
{	
	for (var key in data)
	{		
		addOptionToDropDown(data[key], dropdownName);
	}
}

function addOptionToDropDown(value, dropdownName)
{	
	var dropDown = document.getElementById(dropdownName);
	var newOption = document.createElement("option");	
	newOption.value = value;
	newOption.text = value;
	dropDown.appendChild(newOption);
}

function addToList(button)
{ 	
	var buttonName = button.name;

	var newValue = prompt("Enter new "+ buttonName +":");
	if (newValue == null || newValue == "") {
        txt = "User cancelled the prompt.";
    } 
	else 
	{
		var cityRef = db.collection(buttonName).add({buttonName: newValue});		   
    }
	document.getElementById(buttonName).innerText = null;
	getList(buttonName);
}