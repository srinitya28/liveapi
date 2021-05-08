const { request } = require('express');
var express = require('express');
var app = express();
var port = 8900;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
//const mongourl = "mongodb://localhost:27017";
const mongourl = "mongodb+srv://srinitya:sridatabase@cluster0.kea7k.mongodb.net/sampledata1?retryWrites=true&w=majority";
let db;
const cors = require('cors');


app.get('/',(req,res) => {
    res.send("HIiii..iii")
})

app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) => {
        res.send(result)
    })
    
})



MongoClient.connect(mongourl,(err,connection) =>{
    if(err) throw err;
    db = connection.db('sampledata1')
})

app.listen(port,function(err){
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
})