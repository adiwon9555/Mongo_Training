require('./config/config.js')
const {mongoose}=require('./db/mongoose.js');
const {Todo}=require('./model/todo.js');
const {User}=require('./model/user.js');

const _=require('lodash');
const {ObjectID}=require("mongodb");
const express=require('express');
const bodyParser=require('body-parser');

var app=express();
var port=process.env.PORT;
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    var todo=new Todo(req.body)
    todo.save().then((todo)=>{
        res.send({todo});
    },(err)=>{
        res.status(400).send(err);
    })
})
app.post('/users',(req,res)=>{
    var data=_.pick(req,body,['email','password']);
    var user=new User(data);
    user.save().then((user)=>{
        res.send({user});
    }),(err)=>{
        res.status(400).send(err);
    }
})

app.get("/todos",(req,res)=>{
    Todo.find().then((todos)=>{
        if(!todos){
            return res.status(404).send();
        }
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send();
    })
})
app.get("/todos/:id",(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    })
})
app.delete("/todos/:id",(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    })
})
app.patch("/todos/:id",(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    if(_.isBoolean(req.body.completed) && req.body.completed === true)
    {
        body.completedAt=new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    })
})


app.listen(port,()=>{
    console.log(`Express started on port ${port}`);
})

module.exports={app};