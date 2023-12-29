const mongoose = require('mongoose');
const zod = require("zod")

// Connect to MongoDB
mongoose.connect('mongodb+srv://tejasbayaskar:Omboss8506%40@cluster0.fhjtmo2.mongodb.net/course_app');

// Define schemas

const secretKeyAdmin = "top-secret-admin"
const secretKeyUser = "top-secret-user"

const emailSchema = zod.string().email()
const passwordSchema = zod.string().min(5)

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course,
    emailSchema,
    passwordSchema,
    secretKeyAdmin,
    secretKeyUser
}