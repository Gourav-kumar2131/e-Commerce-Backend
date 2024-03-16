// Categories required , i) name ii) description
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
    
},{versionKey: false, timestamps: true});

module.exports = mongoose.model("category", categorySchema);

/**
 * 
exports.createNewCategory = (req, res)=>{
    
    // Read the request body

    // Create the category object

    // Insert the mongodb

    //return the response of the created category
     
}
 */
