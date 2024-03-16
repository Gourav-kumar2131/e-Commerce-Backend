const mongoose = require('mongoose');

/**
 *  name 
 *  userId
 *  pass
 *  email
 *  useType
 */

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unique: true,
    },
    userType : {
        type: String,
        // required: true,
        default: "CUSTOMER",
        enum: [ "CUSTOMER", "ADMIN" ]  // when fix value required.

    }

},{versionKey: false, timestamps: true} )

module.exports = mongoose.model("user", userSchema); // make a collection name users in Mongodb database.
