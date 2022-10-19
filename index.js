import express from "express";
import mongoose from "mongoose";
import {registerValidation, postCreateValidation, loginValidation, } from './validations/auth.js';
import checkAuth from './utils/checkAuch.js';
import * as UserController from './controllers/UserControle.js';
import * as PostController from './controllers/PostController.js';
import * as dotenv from 'dotenv'
dotenv.config()


mongoose.connect(
    `mongodb+srv://Dan_admin:${process.env.MANGO_PASSWORD}@cluster0.9clwxqv.mongodb.net/blog?retryWrites=true&w=majority`
    ).then(()=>{console.log("DB connected")}).catch((err)=>{console.log("DB error: ", err)})

const app = express();
app.use(express.json());


app.post('/login', loginValidation, UserController.login) // check if curr user exist
app.post('/register', registerValidation, UserController.register) // sign up new user and add him to DB
app.get('/me',checkAuth, UserController.getMe) //get data about user

//WORK with each POST
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(process.env.PORT, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log('Server works!')
})

