const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken")
const router = Router();
const {Admin, emailSchema, passwordSchema, secretKeyAdmin, Course} = require("../db")


// Admin Routes
router.post('/signup', async (req, res) => {
    let input = req.body.username
    let username = input.toLowerCase()
    let password = req.body.password
    if(emailSchema.safeParse(username).success && passwordSchema.safeParse(password).success){
        let data = await Admin.find({username: username})
        if(data.length==0){
            const user = new Admin({username: username, password: password})
            await user.save()
                res.status(200).json({msg: "Admin created successfully"})
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
    let data = await Admin.find({
        username: username,
        password: password
    })
    if(data.length == 1){
    let token = jwt.sign({username},secretKeyAdmin)
    res.status(200).json({token: token})            
    }
    else{
        res.status(404).json({err: "User not found"})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let imageLink = req.body.imageLink
    
    const course = new Course({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: true
    })
    let data = await course.save()
        res.status(200).json({msg: "Course created successfully", courseId: data._id})
});

router.get('/courses', adminMiddleware, async (req, res) => {
    let data = await Course.find({})
    res.status(200).json(data)
});

module.exports = router;