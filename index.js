import express from "express";
import mongoose from "mongoose";
import multer from "multer"; //lib for download img
import {registerValidation, postCreateValidation, loginValidation, } from './validations/auth.js';
import {handlesValidationErrors, checkAuth} from './utils/index.js'
import {UserController, PostController } from './controllers/index.js';

import * as dotenv from 'dotenv'
dotenv.config()


mongoose.connect(
    `mongodb+srv://Dan_admin:${process.env.MANGO_PASSWORD}@cluster0.9clwxqv.mongodb.net/blog?retryWrites=true&w=majority`
    ).then(()=>{console.log("DB connected")}).catch((err)=>{console.log("DB error: ", err)})

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'))

// set up storage
const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname)
    },
});
const upload = multer({storage}); // func to use storage


app.post('/login', loginValidation, handlesValidationErrors,  UserController.login) // check if curr user exist
app.post('/register', registerValidation, handlesValidationErrors, UserController.register) // sign up new user and add him to DB
app.get('/me',checkAuth, UserController.getMe) //get data about user

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//WORK with each POST
app.post('/posts', checkAuth, postCreateValidation, handlesValidationErrors, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handlesValidationErrors, PostController.update)

app.listen(process.env.PORT, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log('Server works!')
})

