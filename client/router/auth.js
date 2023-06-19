const express = require('express')
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('../db/conn');
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate")

router.get('/', (req, res) => {
    res.send("this is home page (router.js)");
})

// ============================== using promises ==============================================

// router.post('/register',(req,res)=>{
//     const {name,email,phone,work,password,cpassword}=req.body;
//     if(!name||!email||!phone||!work||!password||!cpassword){
//         return res.status(422).json({error:"please filled all fields"})
//     }
//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"this email is already exist"});
//         }
//         const customer = new User({name,email,phone,work,password,cpassword})

//         customer.save().then(()=>{
//             res.status(201).json({message : "user register successfully"})
//         }).catch((err)=>{res.status(500).json({error:`failed to register ${err}`})

//         })
//     }).catch((err)=>{console.log(err)});
// })


// ======================================== using async await ===================================================

// register router

router.post('/register', async (req, res) => {
    // res.json({message:req.body.name})     to print data in console via postman
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "please filled all fields" })
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "this email is already exist" });
        }
        else if(password!=cpassword){
            return res.status(400).json({message:"password is not matching"})
        }
        else{
            const customer = new User({ name, email, phone, work, password, cpassword })
        
            await customer.save();
            res.status(201).json({ message: "user register successfully" })
        }
  
    } catch (err) { console.log(err) };
})

// ===========================================================================================

// signin router
router.post('/sign',async (req, res) => {
    try{
        let token
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({error:"please fill data"})
        }

        const userLogin = await User.findOne({email:email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password)

            token = await userLogin.generateAuthToken();  //this method is define in userschema file

            console.log("token is here :",token)
            res.cookie("mycookie",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            })
            // console.log("token is here :",document.cookie)
            if(!isMatch){
                res.status(400).json({message:"no signin"})
            }else{
                res.status(200).json({message:"user signin successfully"})
            }
        }
            else{
                res.status(400).json({message:"no signin"})
        }
        
        
    }catch(err){
        console.log(`error : ${err}`);
    }
})

// About us page
// here authenticate is middleware 
router.get('/about',authenticate,(req,res)=>{ 
    console.log("Hello about page")
        res.send(req.rootUser);
    })

//  ContactUs
// get user data in contact us form
router.get("/getdata",authenticate,(req,res)=>{
    // console.log("Hello ContactUs page")
    res.send(req.rootUser); //req.rootUser is define in authenticate.js file 
})

router.post("/contact",authenticate,async (req,res)=>{
    try{
        // console.log("Hello Contact")
        const {name,email,phone,message}=req.body
        if(!name || !email || !phone|| !message){

            console.log("please fill contact form ")
            return res.json({error :"please fill contact form"})
    
        }
        console.log("req.userID ",req.userID)
        const  userContact = await User.findOne({"tokens.token":req.token})  //req.UserID is define in authenticate.js file 
     
        if(userContact){
            
            const userMessage = await userContact.addMessage(name,email,phone,message) //this method is define in userschema file
           
            await userContact.save()
            res.status(201).json({message:"user contact successfully"})
        }


    }catch(err){
        console.log(err)
    }
})

// Logout Page
router.get("/logout",(req,res)=>{
    res.clearCookie('mycookie',{path:'/'})
    res.status(200).send("User Logout"); 
})


module.exports = router;



