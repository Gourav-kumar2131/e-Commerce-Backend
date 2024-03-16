/**
 * Create a middle ware which checks if the request body is proper or correct.
 */
const userModel = require("../models/user.model");

const verifySignUpBody = async (req, res , next)=>{
    try{
        // check for the name 
        if(!req.body.name){
            return res.status(400).send({msg: "failed name is not provided"});
        }

        // check for userId
        if(!req.body.userId){
            return res.status(400).send({msg: "failed userId is not provided"});
        }

        // check for the email
        if(!req.body.email){
            return res.status(400).send({msg: "failed email is not provided"});
        }

        // check for user similar id present or not.
        const user = await userModel.findOne({userId : req.body.userId})
        if(user){
           return res.status(400).send( { msg: "user with similar id already present" }); 
        }

        next()

    }catch(err){
        console.log("Some error has occured");
        res.status(500).send({
            message: "Insufficient details in request body",
        })
    }
}
const bcrypt = require("bcryptjs");

const verifySignin = (req, res, next)=>{
   try{
        // read the request body
        const req_body = req.body

        // check for req body has userId or not 
        if(!req_body.userId){
            return res.status(404).send({
                msg: "Missing UserId"
            })
        }
        
        // check for password
        
        if(!req_body.password){
            return res.status(404).send({msg: "Missing password:"})
        }
        next();
    }
   catch(err){
       console.log("Some error occured");
       return res.status(400).send({msg: "Insufficient details in request body"});
   }
}

const jwt = require("jsonwebtoken");
const secretcode = require("../config/auth.config")

const verifyToken = (req, res, next)=>{
    const token = req.headers['category-maker-token'];

    // check token is valid or not , send with api header
    if(!token){
        return res.status(403).send({
            msg: "Unauthorised: NO TOKEN FOUND!!"
        })
    }
    // validate the token: token made with userid when decode return userID.
    jwt.verify(token, secretcode.secret, async (err, decoded )=>{
        if(err){
            return res.status(403).send({msg:"Unauthorised Access !! - Token Expires"});
        }
        const user = await userModel.findOne({userId : decoded.id});

        if(!user){
            return res.status(403).send({
                msg: "Invalid User: this user for this token doesn't exist"
            })   
        }

        // set the user info in the request body , will used in admin check
        req.user = user

        next()

    })
   
}

const isAdmin = (req, res, next)=>{
    const user = req.user  // since req body has user details

    if(user && user.userType == "ADMIN"){
        next();
    }
    else{
        return res.status(401).send({
            msg: "Unauthorised: Only Admins are allowed to access this endpoint"
        })
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignin: verifySignin,
    verifyToken : verifyToken,
    isAdmin : isAdmin

}