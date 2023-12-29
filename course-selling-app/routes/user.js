const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken")
const {User, emailSchema, passwordSchema, secretKeyUser, Course} = require("../db")
const userMiddleware = require("../middleware/user");


// User Routes
router.post('/signup', async (req, res) => {
    let input = req.body.username
    let username = input.toLowerCase()
    let password = req.body.password
    if(emailSchema.safeParse(username).success && passwordSchema.safeParse(password).success){
        let data = await User.find({username: username})
        if(data.length==0){
            const user = new User({username: username, password: password})
            await user.save()
            res.status(200).json({msg: "User created successfully"})
        }
        else{
            res.status(404).json({msg: "User already exists"})
        }
    }    
    else if(!emailSchema.safeParse(username).success && !passwordSchema.safeParse(password).success){
        res.status(404).json({msg: "Invalid username and password schema"})
    }
    else if(!emailSchema.safeParse(username).success){
        res.status(404).json({msg: "Invalid username schema"})
    }
    else if(!passwordSchema.safeParse(password).success){
        res.status(404).json({msg: "Invalid password schema"})
    }
});

router.post('/signin', async (req, res) => {
    let input = req.body.username
    let username = input.toLowerCase()
    let password = req.body.password
    let data = await User.find({
        username: username,
        password: password
    });
    if(data.length == 1){
    let token = jwt.sign({username},secretKeyUser)
    res.status(200).json({token: token})            
    }
    else{
        res.status(404).json({err: "User not found"})
    }
});

router.get('/courses', userMiddleware, async (req, res) => {
    let data = await Course.find({})
    res.status(200).json(data)
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.decode(token)
    let courseId = req.params.courseId
    let purchase = await User.updateOne(
        {"username": decoded.username},
        {$push: {purchasedCourses: courseId}}
    )
    res.status(200).json({msg: "Course purchased successfully"})
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.decode(token)
    try{
        const user = await User.findOne({username: decoded.username}).populate('purchasedCourses').exec()
        res.status(200).json(user.purchasedCourses)
    }
    catch(err){
        res.status(404).json(err)
        console.log(err);
    }
});

module.exports = router