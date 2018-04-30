        function displaySeaLion()
        { 
            //get ref to database
            var data = firebase.database();

            //gets everything inside sealion
            var sealion = data.ref().child("sealion");      

            //Get reference to body of table that displays sealions
            var displayBody = document.getElementById("displayBody");
            //Remove all current data
            displayBody.innerHTML = '';   

            //Takes sizes of objects in databases and sets colspan dynamically
            sealion.on("value", setColspan);                   
            
            //get snapshot of database. Calls get data function
            sealion.on("value", getData);            
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
            });

        }

        function setColspan(data)
        {
            var sealions = data.val();
            var keys = Object.keys(sealions);  

            //Take first sealion in database and get length of inner objects and assign to table          
            document.getElementById("details").colSpan = Object.keys(sealions[keys[0]].details).length;
            document.getElementById("tags").colSpan = Object.keys(sealions[keys[0]].tags).length;
            document.getElementById("toes").colSpan = Object.keys(sealions[keys[0]].toes).length;
        }