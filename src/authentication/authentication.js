const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { loginValidation } = require('./validation');

exports.authentication = async (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send({status:401, message:"unauthorised access"});
    }
    let token;
    const postManToken = bearerHeader.split(' ')[1];
    if (postManToken == undefined) {
        token = bearerHeader;
    }else{
        token = postManToken;
    }

    //const token = bearerHeader;
    //Verified if our token is legit.
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        async(err, data) => {
            if (err) {
                //if its not valid throw the user out
                return res.status(401).send({status:401, message:"unauthorised access", err:err});   
            }else{
                //if token is valid run this try and catch statement
                //Remember we sign in our token using the users email and password, 
                //when we verify the token, we get those info back.
               console.log(data.email);
                
                try {     
                    const validatedData = await loginValidation.validateAsync({"email":data.email, "password":data.password});
                    const user = await prisma.user.findUnique({
                        where: {
                          email: validatedData.email,
                        },
                        include: {
                            postsAsCreator: {
                                include: {
                                    categories : true
                                }
                            }
                        }
                    });
                    if (user) {
                        req.user = user;
                        next();
                          //still need to check for valid password.
                    }else {
                        return res.status(401).send({ status: 401, message: 'Token isnt valid' });                      
                    }
                    
                } catch (error) {
                    console.log(error)
                    res.status(401).send({status:401, message:"Can not allow this user access the requested page."})
                }
            }            
        }
    )
}
