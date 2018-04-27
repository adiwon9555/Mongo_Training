const {MongoClient, ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
    if(err){
        console.log("Unable to connect");
    }
    else{
        var db=client.db("TodoApp");
        console.log("Connected");
        db.collection("Todos").findOneAndUpdate({_id:new ObjectID("5adf4d8dbe896e013483f418")},
            {
                $set:
                {
                    text:"Drink"
                }
            },{
                returnOriginal:false
            }).then((res)=>{

            console.log(res);
        },(err)=>{
            console.log("error in updating",err);
        })
    }
    client.close();
});