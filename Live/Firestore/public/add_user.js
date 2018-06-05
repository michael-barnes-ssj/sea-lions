function addUser()
{
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    console.log(email);
    console.log(password);

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(user)
	{
		addUserPermissions(user.uid);
		alert("New user added");
		sendPasswordReset();	
		
		
	}).catch(function(error)
	{
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
		console.log(error.message);
		
		if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
		
		
        // ...
    });
}

function addUserPermissions(userID)
{
	var read = document.getElementById("read").checked;
	var write = document.getElementById("write").checked;
	var update = document.getElementById("update").checked;
	var del = document.getElementById("delete").checked;	
	
	db.collection("Users").doc(userID).set({
    read: read,
    write: write,
    update: update,
	delete: del,
    admin: false
})
.then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});  
	
	
}


function sendPasswordReset() 
{
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
		document.getElementById("admin_form").reset();
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
		
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
}


