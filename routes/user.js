const express= require('express');
const routes=express.Router();


const userControlller=require('../controller/user');
const userAuthenticate=require('../middleware/authentication')
const Userchat=require('../controller/chatapp')

routes.post('/signup',userControlller.signUp);
routes.post('/login',userControlller.login);







module.exports=routes;