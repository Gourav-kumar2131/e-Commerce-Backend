/**
 * Controller for creating the category;
 * POST call : localhost:8888/ecomm/api/v1/categories
 * 
 * {
    "name": "Household",
    "description": "This will have all the Household items."
   }
 */      
 
const CategoryModel = require('../models/categories.model')


exports.createNewCategory = async (req, res)=>{
  // Read the request body
  const req_body = req.body 

  // create new category obj
  const categoryObj = {
    name: req_body.name,
    description: req_body.description 
  }

  // insert created category obj to mongodb
  try{
    const res_Category = await CategoryModel.create(categoryObj);

    const createdCategory = {
      name: res_Category.name,
      description: res_Category.description,
      id: res_Category._id,
      createdAt: res_Category.createdAt,
      updatedAt: res_Category.updatedAt
    }
    res.status(201).send(createdCategory);
    
  }
  catch(err){
    console.log("Error while creating the Category", err);
    res.status(401).send({msg: "Error while creating the Category:"})
  }

}

exports.findCategorybyname = async(req, res)=>{
  const categoryName = req.body.name
  
  try{
    const categoryObj = await CategoryModel.findOne({name: categoryName});

    if(!categoryObj){
      return res.status(400).send("Category NOT Found, Invalid collections name")
    }

    // res.status(200).send(categoryObj);  // not send the obj like that

    const resObj = {
      name: categoryObj.name,
      _id: categoryObj._id,
      description: categoryObj.description,
      updatedAt: categoryObj.updatedAt,
      createdAt: categoryObj.createdAt
    }

    res.status(200).send([resObj, {msg: "Succesfully fetched Category "}]);

  }catch(err){
    res.status(400).send({msg: "Error while finding the Category;"});
  }


}
/*
exports.findCategorybyname = (req, res)=>{
  const categoryName = req.body.name

  let promise;
  
  promise = CategoryModel.findOne({ name: categoryName });
 
  promise.then( categoryObj =>{
    res.status(200).send(categoryObj);
  })
  .catch(err =>{
    res.status(400).send({msg:"Error while finding the collections / Invalid name: "});
  })


}*/


exports.findCategorybyId = async (req, res)=>{
  // Read the request body 
  const reqBody = req.body;

  // Check category present in the DB - if not return 
  try{
    const category = await CategoryModel.findById({_id: reqBody._id});
    
    if(!category){
      return res.status(400).send({
        msg: "Invalid! Category: Category not present"
      })
    }
  
    const resCategoryObj = {
      name: category.name,
      description: category.description,
      _Id: category.id,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
  
    }
    // send response - create response obj send name,desc,id, createdAt, updatedAt
    res.status(300).send( resCategoryObj);

  }catch(err){
    return res.status(503).send({msg: "Error!! while finding the categoris"});
  }

}

exports.findAll = (req, res)=>{
  //Supporting the query param
  let categoryName = req.body.name;
  let promise;

  if(categoryName){
    promise = CategoryModel.find({ 
        name: categoryName
    });
  }
  else{
    promise = CategoryModel.find();
  }
   
  promise.then(resCategories=>{
    res.status(200).send(resCategories);
  })
  .catch(rej=>{
    res.status(500).send({msg:"Some internal error occue while findAll categories: "});
  })

}



exports.deleteCategorybyname = async (req, res)=>{
  // Read the request body 
  const categoryname = req.body.name;

  // Check category present in the DB - if not return 
  try{
    const delcategory = await CategoryModel.deleteOne({name : categoryname});
    
    if(delcategory.deletedCount == 1){
      return res.status(300).send({
        msg: "successfully deleted"
      })
    }
    else{
      return res.status(400).send([delcategory, {msg: "Cannot delete: Category not exist"}])
    }

  }catch(err){
    return res.status(503).send({msg: "Error!! while deleting the category"});
  }

  

}

exports.updateCategory = async (req, res)=>{
  const reqCategory = req.body
  const categoryId = req.body._id;
   
  try{
    // const categoryObj = await CategoryModel.findById({_id: categoryId });
    if(!reqCategory.name || !reqCategory.description){
      return res.status(300).send({
        msg: "Invalid!: Either name or description not present in "
      })
    }
    // mongo 
    // const updateCategory = await CategoryModel.updateOne({_id: categoryId},{$set: {name: reqCategory.name}, $set: {description: reqCategory.description }}, {multi: true} );

    /**  const updateCategory = await CategoryModel.replaceOne(
      {_id: categoryId},
      {
        _id: categoryId,
        name: reqCategory.name,
        description: reqCategory.description 
      });
    */ 

    const filter ={
      _id: categoryId
    }
    const updateBody = {
      $set: {
        name: reqCategory.name,
        description: reqCategory.description 
      }
    }
   const updateCategory = await CategoryModel.updateOne(filter, updateBody, {multi: true} );


    if(updateCategory.modifiedCount == 1 ){
      res.status(301).send(updateCategory);
    }
    else{
      res.status(400).send({
        msg: "Cannot update the category"
      })
    } 
   
  }
  catch(err){
    return res.status(404).send({
      msg: "Error while updating the Categories"
    })
  }

}