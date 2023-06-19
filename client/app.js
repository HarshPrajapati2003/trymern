const mongoose = require("mongoose");
const express = require('express')
const router = express.Router();
const dotenv = require("dotenv");
const app = express();
const path = require('path')

var cookieParser = require('cookie-parser')
dotenv.config({path:'./config.env'})
require('./db/conn')
const bodyParser = require("body-parser");
// const user = require('./model/userSchema')

// json ne object ma convert karse
app.use(express.json())              //this is middleware
router.use(bodyParser.json());
app.use(cookieParser());  //this is added because when we get cookie we can write req.cookie.cookieName (which is written in authenticate.js file)
// we link router file to make our route easy
app.use(require('./router/auth'));       //this is middleware

// static files for deployment
app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`server is running on port no. ${PORT}`)
})
// mongodb+srv://hrsdp2683:<password>@cluster0.crclqxx.mongodb.net/?retryWrites=true&w=majority

