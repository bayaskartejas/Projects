const {Router} = require("express")
const jwt = require("jsonwebtoken")
const router = Router()


router.post("/signup", (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    res.status(200).json({
        message: "user signup successful"
    })

})

router.get("/signin", (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const json = jwt.sign(username)
    res.status(200).json({
        message: "signed in successfully",
        json: json
    })
})

router.get("/books", (req,res)=>{
    
})