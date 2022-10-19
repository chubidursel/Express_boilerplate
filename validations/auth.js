import { body } from 'express-validator';


export const loginValidation = [
    body('email', "Unvalid email").isEmail(),
    body('password', "Password must be at least 5 symbols").isLength({min: 5}),
]

export const registerValidation = [
    body('email', "Unvalid email").isEmail(),
    body('password', "Password must be at least 5 symbols").isLength({min: 5}),
    body('fullName', "Put our name").isLength({min: 3}),
    body('avatarUrl', "Unvalid URL").optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Write the title').isLength({min: 3}).isString(),
    body('text', 'Write the text').isLength({min: 5}).isString(),
    body('tags', 'Incorrect tag format').optional().isString(),
    body('imgUrl', "Unvalid URL").optional().isString(),
]   