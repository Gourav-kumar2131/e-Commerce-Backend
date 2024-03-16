//Logic to resgister the user: SignUP

// create/register a user :-> available from anywhere: module creation req.


const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res)=>{

    // Logic to create the user.


    //1. Read the request bofy
    const request_body = req.body

    //2. Insert the data in the Users Collections in MongoDB
    const newuserObj = {
        name: request_body.name,
        userId: request_body.userId,
        email: request_body.email,
        password: bcrypt.hashSync(request_body.password, 8),
        userType: request_body.userType,
    }
    //3.Return the response to the user
    try{
        const user_created =  await userModel.create(newuserObj);  // call back to models
        // return this user
        
        // res.status(201).send(user_created);  // not return user directly.
        
        // not return pass
        const res_obj = {
            name: user_created.name,
            userId: user_created.userId,
            email: user_created.email,
            userType: user_created.userType,
            createdAt: user_created.createdAt,
            updatedAt: user_created.updatedAt
        }
        res.status(201).send(res_obj);
        
    }catch(err){
        console.log("Error while creating the user", err);
        res.status(500).send({  // 500 internal server error
            message: "Some Exception occered:",
        })
    }
}
// localhost:8888/ecomm/api/v1/auth/signin

const secretcode = require('../config/auth.config');

exports.signin = async (req, res)=>{

    //Check if the user id is present in the system
    const user = await userModel.findOne({ userId: req.body.userId });

    // chech the userid is valid or not 
    if(user == null){
        return res.status(401).send({
            msg: "Invalid! userID: Please try again",
        })
    }  
    // check the password is valid or not
    const validPassword = bcrypt.compareSync( req.body.password ,user.password );  // validpass will be either true or false 
    if(!validPassword){
        return res.status(400).send({
            msg: "Invalid! Password.. Please try again"
        })
    }

    // create a jwt token 
    const token = jwt.sign({id: user.userId}, secretcode.secret, {expiresIn: 120});  // expires in 120 minutes

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        userType: user.userType,
        accesstoken: token, // token is of String;
    }) 
}