const MongoClient=require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
    if(err){
        console.log("Unable to connect");
    }
    else{
        var db=client.db("TodoApp");
        console.log("Connected");
        db.collection("Todos").findOneAndDelete({completed:false}).then((res)=>{

            console.log(res);
        },(err)=>{
            console.log("error in deleting",err);
        })
    }
    client.close();
});