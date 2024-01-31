const mongoose = require("mongoose")
require('dotenv').config();
const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;
let connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}`
mongoose.connect(connectionString);

const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
})
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    userTodos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todo'
    }]
})
const user = mongoose.model("users", userSchema)
const todo = mongoose.model("todos", todoSchema)
module.exports = {
    todo,
    user
}