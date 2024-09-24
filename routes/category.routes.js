

// localhost:8888/ecomm/api/v1/auth/categories

const CategoryController = require('../controllers/category.controller')
const authMW = require("../middlewares/auth.mw")
const catReqValidator = require("../middlewares/categoryReqValidator");

module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/categories",[authMW.verifyToken, authMW.isAdmin ], CategoryController.createNewCategory);

    // localhost:8888/ecomm/api/v1/auth/categories/:name
    app.get("/ecomm/api/v1/auth/categories/:name", CategoryController.findCategorybyname );

     //localhost:8888/ecomm/api/v1/auth/categories
    app.get("/ecomm/api/v1/auth/categories", CategoryController.findAll);
    
    
    // localhost:8888/ecomm/api/v1/auth/categories/:id
    app.get("/ecomm/api/v1/auth/categories/:id", CategoryController.findCategorybyId );

    // localhost:8888/ecomm/api/v1/auth/categories/update
    app.put("/ecomm/api/v1/auth/categories/update",[ catReqValidator.requestValidator, authMW.verifyToken , authMW.isAdmin], CategoryController.updateCategory);

    // localhost:8888/ecomm/api/v1/auth/categories/delete
    app.delete("/ecomm/api/v1/auth/categories/delete",[ authMW.verifyToken , authMW.isAdmin], CategoryController.deleteCategorybyname);

}