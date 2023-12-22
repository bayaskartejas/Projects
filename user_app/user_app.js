const express = require ('express')
const jwt = require ('jsonwebtoken')
const mongoose = require ('mongoose')
const zod = require ('zod')
const app = express()
const jwtPassword = "12345"
mongoose.connect("mongodb+srv://tejasbayaskar:Omboss8506%40@cluster0.fhjtmo2.mongodb.net/user_app")
app.use(express.json())
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})
let User = mongoose.model('Users', userSchema)

app.post("/sign-up", async function signup(req,res) {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    await user.save()
    res.status(200).json(user)
})

app.listen(3000)