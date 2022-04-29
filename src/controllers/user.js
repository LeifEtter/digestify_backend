const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();
const { signUpValidation, loginValidation } = require('../authentication/validation.js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

exports.register = async (req, res, next) => {
    console.log(req.body);

    try {
        const validatedData = await signUpValidation.validateAsync(req.body); 
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
            }
        })

        if(!user) {
            console.log("Canot add users");
            res.status(404).send({status: 404, message: "Cannot add to database."});
        } else {
            req.user = _.omit(user, 'password');
            next();
        };

    } catch (error) {
        //Joi data validation error is handled here.
        console.log(error);
        if (error.isJoi === true) {
            console.log("JOI ERR");
            res.status(422).send({ status: 422, message: error.message });
        }else {
            console.log({"prisma error": error});
                if (error.code === "P2002") {
                    res.status(422).send({ status: 422, input:"Email", message: "Email already exist in the database"});
                }else{
                    res.status(422).send({ status: 422, message: error});
                }
        }
    }
}

exports.login = async (req, res) => {
    try {
        const validatedData = await loginValidation.validateAsync(req.body);
        const user = await prisma.user.findUnique({
          where: {
            email: validatedData.email,
          },
        });
        if (!user) {
            console.log(err);
            return res.status(401).send({status:401, message:"User not found"})
            
        }else {
        const passwordValid = await bcrypt.compare(validatedData.password, user.password);

        if (passwordValid) {
            jwt.sign(
                {email:user.email, password:user.password},
                process.env.JWT_SECRET, 
                (err, token) =>{
                    if (err) {
                        console.log(err);
                        return res.status(401).send({status:401, message:err});
                    }
                    res.status(200).send({status:200, token:token, id:user.id });
                }
            );
        }else if (!passwordValid) {
            res.status(422).send({ status: 422, message: 'Email or Password Incorrect' });
        }
        }
        
    } catch (error) {
        
        if (error.isJoi === true) {
          res.status(422).send({ status: 422, message: error.message });
        }
        console.log(error);
        res.status(401).send({ status: 422, message: 'User credential do not exist' });  
    }
}
