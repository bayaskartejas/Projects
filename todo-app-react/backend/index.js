const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const authMiddleware = require("./authMiddleware")
const {createTodo, updateTodo, emailSchema, passwordSchema} = require("./types")
const { todo, user } = require("./db")
const cors = require("cors")
require('dotenv').config();
const { JWT_KEY} = process.env;
const jwt = require("jsonwebtoken")

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())


app.post("/todos", authMiddleware,async (req,res)=>{
    const token = req.headers.authorization
    let decoded = jwt.decode(token)
    const createPayload = req.body
    const parsedPayload = createTodo.safeParse(createPayload)
        if(!parsedPayload.success){
            res.status(411).json({
                msg: "you sent the wrong inputs",
                err: parsedPayload
            })
            return
        }
        else{
            const response = await todo.create({
                title: createPayload.title,
                description: createPayload.description,
                completed: false
            })

            await user.updateOne(
                {"username": decoded.username},
                {$push: {userTodos: response._id}}
            )

            const thatTodo = await todo.findById(response._id)
            res.status(200).json({
                msg:"todo created",
                response: thatTodo
            })
        }
})

app.get("/todos", authMiddleware,async (req,res)=>{
    const token = req.headers.authorization
        let decoded = jwt.decode(token)
        const TheUser = await user.find({username: decoded.username})
        let data = TheUser[0].userTodos
        let todos =[]
        for(let i=0; i<data.length; i++){
            let file = await todo.find({_id: data[i]})
            todos.push(file)
        }
        res.status(200).json(todos)
})

app.put("/completed", async (req,res)=>{
    const updatePayload =  req.body
    const parsedPayload = updateTodo.safeParse(updatePayload)
        if(!parsedPayload.success){
            res.status(411).json({
                msg: "you sent the wrong inputs"
            })
            return
        }
        else{
            let thatTodo;
            const aTodo = await todo.findOne({_id: req.body.id})
            if(aTodo.completed){
            await todo.findOneAndUpdate({_id: req.body.id}, {completed: false})
            thatTodo = await todo.findOne({_id: req.body.id})                
            }
            else{
            await todo.findOneAndUpdate({_id: req.body.id}, {completed: true})
            thatTodo = await todo.findOne({_id: req.body.id})   
            }
            res.json({msg: "todo updated",thatTodo})
        }
})

app.post("/signup", async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    if(emailSchema.safeParse(username).success && passwordSchema.safeParse(password).success){
        let data = await user.find({
            username: username,
            password: password
        })
        if(data.length == 0){
            await user.create({
                username: username,
                password: password
            })
            res.status(200).json({msg: "User created successfully"})
        }
        else{
            res.status(411).json({msg: "User already exists"})
        }
    }
    else{
        res.status(411).json({msg: "wrong inputs"})
    }
})

app.post("/signin", async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
        let data = await user.find({
            username: username,
            password: password
        })
        if(data.length == 1){
            const token = jwt.sign({username}, JWT_KEY)
            res.status(200).json(token)
        }
        else if(data.length == 0){
            res.status(411).json({msg: "User doesn't exist"})
        }
    })

app.post("/deleted", authMiddleware, async (req,res)=>{
    const updatePayload =  req.body
    let token = req.headers.authorization
    let decoded = jwt.decode(token)
    const parsedPayload = updateTodo.safeParse(updatePayload)
        if(!parsedPayload.success){
            res.status(411).json({
                msg: "you sent the wrong inputs"
            })
            return
        }
        else{
            let data = await user.findOneAndUpdate({"username": decoded.username}, {$pull: {userTodos: req.body.id}})
            await todo.deleteOne({ _id: req.body.id })
            res.status(200).json(req.body.id);
            }
})

app.listen(3000)