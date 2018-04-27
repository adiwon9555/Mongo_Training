const MongoClient=require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
    if(err){
        console.log("Unable to connect");
    }
    else{
        var db=client.db("TodoApp");
        console.log("Connected");
        db.collection("Todos").insertOne({
            text:"Brush",
            completed:false
        },(err,result)=>{
            if(err){
                return console.log("Insertion Unsuccessfull",err);
            }
            console.log(JSON.stringify(result.ops,undefined,2))
        })
    }
    client.close();
});