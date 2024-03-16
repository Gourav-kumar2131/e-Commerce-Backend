const requestValidator = async (req, res, next)=>{
    if(!req.body._id){
        res.status(400).send({msg: "Cannot find the _id : Id is missing!!"})
        return;
    }
    if(!req.body.name){
        res.status(400).send({msg: "Cannot find the name : Name is missing!!"})
        return;
    }
    if(!req.body.description){
        res.status(400).send({msg: "Cannot find the Descriptions : Description of Category  is missing!!"})
        return;
    }

    next();
}

module.exports = {
    requestValidator : requestValidator,
}