var currentUser; 

function getUser()
{
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user.uid);
        getUserPermissions(user.uid);
    }
    });
}

function getUserPermissions(id)
{ 
    db.collection("Users").doc(id).get().then(function(user) 
    {   
        currentUser = user.data();
        console.log(currentUser);
    })
    .catch(function(error) 
    {
        console.log("Error getting documents: ", error);
    });
}

function checkPermissions()
{
    if (currentUser.admin = true)
    {
        window.location.replace('admin_page.html');
    }
    else
    {
        alert("nah");
    }
}

