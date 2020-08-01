const mongoose = require("mongoose")


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = '/Task-Manager-api'


mongoose.connect(connectionURL+databaseName,
    {useNewUrlParser:true,useUnifiedTopology: true , useCreateIndex:true})




/*
const newUser = new User({
    password:"pass1234",
    name : "kamal",
    age :21,
    email:"3bdelra7man.kamal@gmail.com"
}).save().then(result => console.log(result)).catch(error => console.log(error)) 


const newTask = new Task({
    description: "finish this fckin course",
    completed: false
}).save().then(result => console.log(result)).catch(error => console.log(error)) */