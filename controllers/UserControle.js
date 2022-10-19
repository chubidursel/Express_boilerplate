import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';
import UserModel from '../models/User.js';

export const register = async(req, res)=>{
    try {
     const errors = validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json(errors.array())
    }
 
    //Hashing the incoming password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
 
 // preparing a new User for DB
    const doc = new UserModel({
     email: req.body.email,
     fullName: req.body.fullName,
     avatarUrl: req.body.avatarUrl,
     passwordHash: hash
    })
 
 //save to DB
    const user = await doc.save();
 
 // create hash token ID
    const token = jwt.sign(
     {_id: user._id,},
     "secret123",
     {
         expiresIn: '30d'
     }
    );
 
 //get rid of the password hash to return
     const {passwordHash, ...userData} = user._doc
 
    res.json({
     ...userData,
     token
    })
    } catch (error) {
     console.log(error)
     res.status(500).json({
         message: "Registration Failed!" 
     })
    }
 }


export const login = async(req, res)=>{
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user){
            return res.status(404).json({
                message: 'User undifind',
            })
        }
    //check the user password
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message: 'Invalid password or email',
            })
        };

    //token
    const token = jwt.sign(
        {_id: user._id,},
        "secret123",
        {
            expiresIn: '30d'
        }
       );
        const {passwordHash, ...userData} = user._doc
    
       res.json({
        ...userData,
        token
       })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Login Failed!" 
        })
    }
}


export const getMe = async(req, res)=>{
    try {
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'User undifined =('
            })
        }

        // IF u found user do this
        const {passwordHash, ...userData} = user._doc
        res.json(userData)
    } catch (error) {
        console.log(error)
    }
}