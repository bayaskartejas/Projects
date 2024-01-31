const jwt = require("jsonwebtoken")
require('dotenv').config();
const { JWT_KEY} = process.env;
function authMiddleware(req, res, next){
    const token = req.headers.authorization    
    try{
        jwt.verify(token, JWT_KEY)
        next()
    }
    catch(err){
        res.status(404).json(err)
    }    
}
    
module.exports = authMiddleware;