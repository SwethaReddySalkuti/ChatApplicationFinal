const jwt=require('jsonwebtoken')


const User=require('../models/user');

const authenticate=async(req,res,next)=>{
    const token=req.header('Authorization')
    try {
        const user=jwt.verify(token,process.env.JSON_WEB_SECRETKEY);
        console.log('userId',user.userId);
        const dataUser=await User.findByPk(user.userId);
        console.log(dataUser);
        req.user=dataUser;
        next();

        
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false});
    }
}

module.exports={authenticate}