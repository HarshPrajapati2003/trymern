const jwt = require("jsonwebtoken")
const User = require("../model/userSchema")

const Authenticate = async(req,res,next)=>{
    try{
        
        const token=req.cookies.mycookie
        console.log("this is token...  ",token)
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY)
        console.log("this is verify token...  ",verifyToken)

        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token})

        if(!rootUser){throw new Error("User not found")}

        req.token=token
        req.rootUser=rootUser
        req.userID=rootUser._id
        console.log("req.userID ",req.userID)
        next();

    }catch(err){
        res.status(401).send("No token provided")
        console.log("auth err: ",err)
    }
}

module.exports = Authenticate