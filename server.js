/**
 * This file is the starting point of our Project.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const express = require('express');
const app = express();

const serverConfig = require('./config/server.config');
const db_config = require("./config/db.config");
const user_model = require('./models/user.model');





/**
 * connet with mongodb
 */
mongoose.connect(db_config.DB_URL);

const db = mongoose.connection

db.on("error", ()=>{
    console.log("Error while connecting the Ecomm database");
})
db.once("open",()=>{
    console.log("Connected to MongoDB: ");
    init();
})

/**
 * Create an admin user at the starting of the application 
 * if not present already: 
 * 
 */

async function init(){
    const user = await user_model.findOne({userId : "admin"});
    if(user){
        console.log("Admin is already present");
        return; 
    }
    try{
        // create a user: admin
        const admin = {
            name: "Gourav",
            userId: "admin",
            email: "Admin@2131",
            password: bcrypt.hashSync("amdmin123",8),
            userType: "ADMIN",

        }
        const user = await user_model.create(admin);
        console.log("Admin created", user);

    }catch(err){
        console.log("Error caught while creating user", err);
    }
}

/**
 * stich the route to the server.
 */
app.use(express.json()); // middleware; Json -> Js Obj

require("./routes/auth.routes")(app) // calling routes & passing app object.

require("./routes/category.routes")(app) // calling the category routes and~


// start the server: server are customizable so it should be centralised anywhere else
app.listen(serverConfig.PORT, ()=>{
    console.log("Server Started at " ,serverConfig.PORT);
})
