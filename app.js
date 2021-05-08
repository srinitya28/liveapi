const { request } = require('express');
var express = require('express');
var app = express();
var port = process.env.PORT||8080;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
//const mongourl = "mongodb://localhost:27017";
const mongourl = "mongodb+srv://srinitya:sridatabase@cluster0.kea7k.mongodb.net/sampledata?retryWrites=true&w=majority";
let db;
const cors = require('cors');
const bodyParser = require('body-parser');
//middle ware

app.use(cors());
//use in post call to pass the data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

//first route(default)
app.get('/',function(req,res){
    res.send("Hi from my lp")
})


app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) => {
        res.send(result)
    })
    
})

//rest details
app.get('/rest/:id',(req,res) => {
    //var id = req.params.id
    let {id} = req.params;
    db.collection('restaurent').find({_id:id}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurent',(req,res) => {
    //console.log(req.query.city)
    var condition = {};
    let sortcondition = {cost:1};
    if(req.query.sort){
        sortcondition={cost:Number(req.query.sort)}
    }
    //meal+city
    if(req.query.city && req.query.mealtype){
        //condition = {city:req.query.city}
        condition={$and:[{"type.mealtype":req.query.mealtype},{city:req.query.city}]}
    }
    //meal+cuisine
    else if(req.query.cuisine && req.query.mealtype){
        condition={$and:[{"type.mealtype":req.query.mealtype},{"Cuisine.cuisine":req.query.cuisine}]}
    }
    // city
    else if(req.query.city){
        condition = {city:req.query.city}
    }
    // mealtype
    else if(req.query.mealtype){
        condition = {"type.mealtype":req.query.mealtype}
    }
    // cuisine
    else if(req.query.cuisine){
        condition = {"Cuisine.cuisine":req.query.cuisine}
    }
    //cost
    else if(req.query.lcost && req.query.hcost){
        condition = {$and:[{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
    }
    db.collection('restaurent').find(condition).sort(sortcondition).toArray((err,result) =>{
        res.send(result)
    })
})

//place order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('data added')
    })
})

//meal type
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find().toArray((err,result) => {
        res.send(result)
    })
})
//cuisine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find().toArray((err,result) => {
        res.send(result)
    })
})

//  viewBooking
app.get('/orders',(req,res) => {
    db.collection('orders').find().toArray((err,result) => {
        res.send(result)
    })
})



//connection with data base
MongoClient.connect(mongourl,(err,connection) =>{
    if(err) throw err;
    db = connection.db('sampledata')
})

app.listen(port,function(err){
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
})