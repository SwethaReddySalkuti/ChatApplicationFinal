const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccesswebtoken(id,name)
{
    return jwt.sign({userId:id,name},process.env.JSON_WEB_SECRETKEY)
}


// string validation
const isstringinvalid=(string)=>
{
   if(string== undefined ||string.length===0) 
   {
      return true;
   }
   else 
   {
      return false;
   }

}







const signUp=async (req,res,next)=>{

    try 
    {
        const {name,email,phonenumber,password}=req.body;
        if(isstringinvalid(name)||isstringinvalid(email)||isstringinvalid(phonenumber)||isstringinvalid(password)){
            return res.status(400).json({message:'Something is inappropriate',success:false})
        }

        const user=await User.findOne({where:{email}});
        if(user)
        {
            return res.status(404).json({success:false,message:"User Already Exist"})
        }
        if(user==null){
             let saltRound=10;  //constant key used in creating hash password
            bcrypt.hash(password,saltRound,async (err,hash)=>{
            if(err) 
            console.log(err);
            await User.create({name,email,phonenumber,password:hash});
            res.status(200).json({message:'Successfully created a User',success:false})
         })

    }

    }catch (error) {
            res.status(500).json({error});
            console.log(JSON.stringify(error));
        
    }
}








const login=async (req,res,next)=>{
    
   
    try {
        const {email,password}=req.body;
        if(isstringinvalid(email)||isstringinvalid(password)){
            return res.status(400).json({message:'Some field is missing or inappropriate',success:false})
        }
        const user=await User.findOne({where:{email:email}});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({success:false,message:"Something Went wrong"})
                }
                if(result==true){
                    res.status(200).json({message:'successfully user login',success:true,token:generateAccesswebtoken(user.id,user.name)})
                }
                else
                {
                    res.status(401).json({success:false,message:"Password incorrect"})
                }
            })

        }
        if(user==null){
               return  res.status(404).json({success:false,message:"Users Not Found"})
          }

        
    } catch (error) {
     
        res.status(500).json({error});
        console.log(JSON.stringify(error));
        
    }
}


module.exports={signUp,isstringinvalid,login};