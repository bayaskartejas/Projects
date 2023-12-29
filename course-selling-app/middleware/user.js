const jwt = require('jsonwebtoken')
const {secretKeyUser, Course} = require("../db")

// Middleware for handling auth
function userMiddleware(req, res, next) {
    let token = req.headers.authorization.split(' ')[1]
    try{
        jwt.verify(token, secretKeyUser)
        next()
    }
    catch(err){
        res.status(404).json(err)
    }
    
}

module.exports = userMiddleware;