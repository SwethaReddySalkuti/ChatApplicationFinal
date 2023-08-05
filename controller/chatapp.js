
const Message=require('../models/chat');
const AWS = require('aws-sdk');
               
//const multer = require('multer');          //middleware      // helps in handling multiform data 
// used whilestoring file in multer memory or disk storage       

const addMessage=async (req,res,next)=>{
    try 
    {
        const {message,groupId}=req.body;
        await Message.create({ message,name:req.user.name,userId:req.user.id,groupId,type:'text' });
        const newMessage={message,name:req.user.name,userId:req.user.id}
        res.status(200).json({newMessage,msg:'Message Sent Successfully',success:true})
        
    } 
    catch (error) 
    {
        res.status(500).json({error})
    }
}

const getMessages=async(req,res,next)=>{
           
   try 
   {
        const groupId=req.params.groupId;
        const data=await Message.findAll({where:{groupId}});
        
        res.status(202).json({allGroupMessages:data,success:true})
   } 
   catch (error) 
   {
        
        res.status(500).json({msg:'Sorry! Something went Wrong',error})
   }

}





///s3upload

const uploadFile=async(req,res,next)=>{
  
    try {
       
        const {groupId}=req.params;
        const userId=req.user.id;
        const userName=req.user.name;
        const filename="File"+userId+"/"+Date.now()+Math.random();
        const fileUrl=await uploadToS3(req.file,filename);
        await Message.create({groupId,userId,message:fileUrl,name:userName,type:'file'});
        const userFile={
            message:fileUrl,
            name:userName,
            userId
        }
        res.status(201).json({userFile,success:true})  
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Error uploading file',error})
    }


}


async function uploadToS3(data, filename) {

  console.log('haiiiiiiiiiiiiiiiiiii Swethaaaaaaaaaaaaaaa');
      const BUCKET_NAME = process.env.S3BUCKET_NAME;
      const IAM_USER_KEY = process.env.S3BUCKET_ACCESS_KEY;
      const IAM_USER_SECRET = process.env.S3BUCKET_SECRET_KEY;
  
    const s3= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET

    });
    const file=data;
    const key=`uploads/${id}-${filename}`
      const params = {
        Bucket:BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',         // a Network Access Control List       // privilages 
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('Error while Uploading File', err);
            reject(err);
          } else {
            console.log('File Uploaded Successfully:', data.Location);
            resolve(data.Location);
          }
        });
      });
  }
  


module.exports={addMessage,getMessages,uploadToS3,uploadFile}