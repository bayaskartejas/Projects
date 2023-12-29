const jwt = require('jsonwebtoken')
const {secretKeyAdmin} = require("../db")

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    let token = req.headers.authorization.split(' ')[1]
    try{
        jwt.verify(token, secretKeyAdmin)
        next()
    }
    catch(err){
        res.status(404).json(err)
    }
    
}

module.exports = adminMiddleware;