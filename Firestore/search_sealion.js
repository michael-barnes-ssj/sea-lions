
//TO ACCEPT SEARCH FIELDS AS ASSOC ARRAY IN FUTURE
function search()
{
    // //let searchFieldDict = {name:"Mum"};
    // var sealions = db.collection("Sea Lions");
    // var query = sealions.where("name", "==", "Mum");
    // query.get().then((data)=>{
    //     console.log(data);
    //     data.docs.forEach((d) => {console.log(d.data());
    //     });
    // });

    db.collection("Sea Lions").get().then(function(lions) 
    {
        matches = [];
        lions.forEach((lion) => {
            lion.doc("details").where('name', '==', 'kyukukuyk').get().then( (data) => {
                console.log(data);
            })
        });
        //console.log(document.id, '=>', document.data());
        //document.forEach((d) => {console.log(d.data());});
    });

    // var sealions = db.collection('test');
    // var query = sealions
    //     .where('name', '==', 'test')
    //     .get()
    //     .then(snapshot => {
    //         snapshot.forEach(document => {
    //             console.log(document.id, '=>', document.data());
    //         });
    //     })
}