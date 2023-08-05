const User=require('../models/user');
const Message=require('../models/chat');
const Group = require('../models/group');
const UserGroup = require('../models/usergroup');
const sequelize = require('../utils/database');        // for transaction purpose

async function createGroup(req,res,next){
    
    try {
        const {groupname}=req.body;
        const group=await Group.create({groupname,createdBy:req.user.id} );
        await UserGroup.create({groupId:group.id,userId:req.user.id});
       
        res.status(201).json({msg:`Successfully Created group ${groupname}`})
        
    } catch (error) {
        
        res.status(500).json({msg:"No Group created",error})
        
    }
}




async function getAllGroups(req,res,next){
    try 
    {
        const user=await User.findOne({where : {id:req.user.id}});
        const groups=await user.getGroups();
        res.status(201).json({groups,success:true})
        
    } 
    catch (error) 
    {
        res.status(500).json({msg:'Cannot Get Groups',error})
        
    }
}




async function addUserToGroup(req,res,next){
    
  try 
  {
        const email=req.body.memberEmail;
        const groupId=req.body.groupid
    
      const user=await User.findOne({where: {email}});
      if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(member) 
      return res.status(404).json({msg:"User Already present in the group",success:false})
       
      await UserGroup.create({groupId,userId:user.id});
      res.status(201).json({msg:"User Added Successfully",success:true})
  } 
  catch (error) 
  {
      res.status(500).json({msg:"Error ,Please try again",success:false,error})
    
  }
}







async function removeUserFromGroup(req,res,next){
    

  try 
  {
        const email=req.body.memberEmail;
        const groupId=req.body.groupid
      const user=await User.findOne({where: {email}});
      if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(!member) 
      return res.status(404).json({msg:"User, not a Member in the group",success:false})
       
      await UserGroup.destroy({groupId,userId:user.id});
      res.status(201).json({msg:"Member Removed Successfully",success:true})
  } 
  catch (error) 
  {
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}





async function changeGroupAdmin(req,res,next){
  try 
  {
        const email=req.body.memberEmail;
        const groupId=req.body.groupid;
      const user=await User.findOne({where: {email}});
      if(!user)   
      return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(!member) 
      return res.status(404).json({msg:"User not a Member in the group",success:false})
       
      await Group.update({createdBy:user.id},{where:{id:groupId}});
      res.status(201).json({msg:"Admin Change Successfull",success:true})
  } 
  catch (error) 
  {
      res.status(500).json({msg:"Error ,Please try again",success:false,error})
    
  }
}




async function deletGroup(req,res,next){
    // transactions
    const t = await sequelize.transaction();
    try {
        const {id}=req.params;
        await Group.destroy({where:{id}},{transaction : t});
    
        await UserGroup.destroy({where:{groupId:id}});
        
        await Message.destroy({where:{groupId:id}});
        await t.commit();
        res.status(201).json({msg:"Group Deleted Successsfully"})
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
      
        
    }

}
module.exports={createGroup,getAllGroups,addUserToGroup,removeUserFromGroup,changeGroupAdmin,deletGroup}