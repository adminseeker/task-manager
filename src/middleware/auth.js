const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req,res,next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ",'');
        const decoded =jwt.verify(token,process.env.jwt_secret);
        const user =await User.find({_id:decoded._id},{"tokens.token":token}).select("name age email password");
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({error:"Please Authenticate."});
    }
};

module.exports = auth;