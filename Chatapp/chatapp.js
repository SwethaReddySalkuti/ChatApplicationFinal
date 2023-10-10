
const socket = io.connect("http://localhost:3000");      //


socket.on("message",(msg,userName,groupId,userId) =>{

     if(localStorage.getItem('currentGroupId')){
      let grpId=localStorage.getItem('currentGroupId');
      let token = localStorage.getItem('token')
      let currentUser=parseJwt(token)
      if(groupId == grpId){
        const chats=document.getElementById('chat-messages');
        const newPara = document.createElement('li');
        newPara.innerText = `${userName}: ${msg}`;
        chats.appendChild(newPara);

      }
     }
});

socket.on("file",(message,userName,groupId,userId) => {
  if(localStorage.getItem('currentGroupId')){
    let grpId=localStorage.getItem('currentGroupId');
    const token = localStorage.getItem('token')
    let currentuser=parseJwt(token);
    const chats=document.getElementById('chat-messages'); 

    if(groupId == grpId){
    let newpara=document.createElement('li');
    let fileLink = document.createElement('a');
    fileLink.href=message;
    fileLink.innerText="click to see(download)";

    newpara.appendChild(document.createTextNode(`${userName}:`))
    newpara.appendChild(fileLink);
   chats.appendChild(newpara)
  
    }  
  }
})





//domcontent

window.addEventListener('DOMContentLoaded',async()=>{
    displayGroups();
    loadchats();
  
})






function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}








async function createGroup(){
  const groupname=prompt("Enter the New Group Name:")
try {
  if(groupname){
    const token=localStorage.getItem('token');
    const res=await axios.post('http://localhost:3000/groups',{groupname},{headers:{"Authorization":token}})
    console.log(res.data.msg);
    showMessageDiv(res.data.msg);
    displayGroups();
  }
  
  if(groupname==null){
    console.log('no groupcreated')
    showMessageDiv('no groupcreated')
  }
} catch (error) {
  console.log(error);
  showMessageDiv(error.response.data.msg) 
}
}





function showMessageDiv(msg){
    let parentNode=document.getElementById('messageDiv');
    parentNode.innerHTML=`<p>${msg}</p>`
   
    setTimeout(()=>{
        parentNode.innerHTML='';
    },3000)

}






async function getAllgroups(){
  try {
    const token =localStorage.getItem('token');
    const res=await axios.get('http://localhost:3000/groups',{headers:{"Authorization":token}})
    return res.data.groups;
  } catch (error) {
    document.body.innerHTML+=`<div style="color: red;text-align: center;">
                                   <h3>${error}</h3>
                              </div>`
  }
}





async function displayGroups(){
  try {
          const userId=parseJwt(localStorage.getItem('token')).userId;
          const groups=await getAllgroups();
          console.log(groups);
          let ul=document.createElement('ul')
          for(let i in groups)
          {
                let li =document.createElement('li');
                let line = document.createElement('li');
                li.setAttribute('groupId',groups[i].id);
                li.setAttribute('createdBy',groups[i].createdBy);
                if(groups[i].createdBy===userId) console.log(true);
               // li.textContent=groups[i].groupname;
                let openChatbutton=document.createElement('button');
                openChatbutton.className='btn-same'
                openChatbutton.textContent=groups[i].groupname;
                openChatbutton.style.backgroundColor ="black"
                openChatbutton.style.padding = '3px';
                openChatbutton.style.width = '20%'
                openChatbutton.style.color = "white"
                openChatbutton.addEventListener('click',groupchatpage)
                li.appendChild(openChatbutton);
                if(groups[i].createdBy===userId)
                {

                  let addButton=document.createElement('button');
                  addButton.className="btn-same";
                  addButton.textContent="+ User";
                  addButton.addEventListener('click',addMembers);
            
                  let delButton=document.createElement('button');
                  delButton.textContent="- User";
                  delButton.className="btn-same";
                  delButton.addEventListener('click',RemoveMember);
            
                  let adminButton=document.createElement('button');
                  adminButton.className="btn-same"
                  adminButton.textContent="+/- Admin";
                  adminButton.addEventListener('click',changeAdmin)
            
            
                  let delGroupButton=document.createElement('button');
                  delGroupButton.className="btn-same";
                  delGroupButton.textContent="Delete";
                  delGroupButton.addEventListener('click',removeGroup)

                  li.appendChild(addButton);
                  li.appendChild(delButton);
                  li.appendChild(adminButton);
                  li.appendChild(delGroupButton);
      
                }
                   
                 
                  line.innerHTML = '_________________________________________________________________';
                  
                  ul.appendChild(li);
                  ul.appendChild(line);
                  

          


                
              }      
             
                document.getElementById('allgrouplist').innerHTML='';
                document.getElementById('allgrouplist').appendChild(ul);
    
  } catch (error) {
    document.body.innerHTML+=`<div style="color: red;text-align: center;">
                              <h3>${error}</h3>
                              </div>`
  }

}







async function addMembers(e){
  e.preventDefault();
  const memberEmail=prompt('Enter Member Email')
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.post('http://localhost:3000/groups/addmembers',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
    }
    else{
      
      showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}








async function RemoveMember(e){
  e.preventDefault();
  const memberEmail=prompt('Enter Member Email You want to remove')
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.post('http://localhost:3000/groups/removemembers',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
    }
    else{
      console.log("no memeber");
      showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }

}







async function changeAdmin(e){
  e.preventDefault();
  const memberEmail=prompt('Enter Member Email You want to remove')
  try {
    let data={
      groupid:e.target.parentElement.getAttribute('groupId'),
      memberEmail
    }
    if(memberEmail){
      let token=localStorage.getItem('token');
      const res=await axios.patch('http://localhost:3000/groups/changeAdmin',data,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
      displayGroups();
    }
    else{
      console.log("no memeber");
      showMessageDiv('Please Enter Email Try again !!')
    }
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}






async function removeGroup(e){
  e.preventDefault();
  try {

      const groupid=e.target.parentElement.getAttribute('groupId');
  
      let token=localStorage.getItem('token');
      const res=await axios.delete(`http://localhost:3000/groups/deletegroup/${groupid}`,{headers:{"Authorization":token}})
      showMessageDiv(res.data.msg)
      displayGroups();
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}







async function groupchatpage(e){
  e.preventDefault();
  let groupId=e.target.parentElement.getAttribute('groupId');
  document.getElementById('chat-messages').style.visibility="visible";
  document.getElementById('user-input').style.visibility='visible';
  localStorage.setItem('currentGroupId',groupId);
  loadchats();

}






async function loadchats(){
  const token = localStorage.getItem('token');
  const groupId=localStorage.getItem('currentGroupId');
try {
    const res=await axios.get(`http://localhost:3000/chat/${groupId}`,{headers:{"Authorization":token}}); 
    console.log(res.data.allGroupMessages);
    displayChats(res.data.allGroupMessages);

} catch (error) {
    
    showMessageDiv(error.response.data.msg)
  
}

}






async function displayChats(allgroupchats){
  try {
    const token = localStorage.getItem('token');
    const currentUser = parseJwt(token);
    const chats = document.getElementById('chat-messages');
    chats.innerHTML = '';
    
    console.log(allgroupchats);

    if(allgroupchats.length>10){
      allgroupchats=allgroupchats.slice(allgroupchats.length-10)
    }  
    for (const chat of allgroupchats) {
      const newPara = document.createElement('li');
   if(chat.type == 'text'){
      if (chat.userId === currentUser.userId) {
        newPara.innerText = `You: ${chat.message}`;
      } else {
        newPara.innerText = `${chat.name}: ${chat.message}`;
      }

    }

    else{
      let fileLink = document.createElement('a');
      fileLink.href=chat.message;
      fileLink.innerText="click to see(download)";
    
      if(chat.userId == currentUser.userId){
        newPara.appendChild(document.createTextNode(`You:`))
      }
      else{
        newPara.appendChild(document.createTextNode(`${chat.name}:`))
      } 
      newPara.appendChild(fileLink);
    }
     
      chats.appendChild(newPara);
    }
    
    
  } catch (error) {
    console.log(error);
    showMessageDiv(error.response.data.msg)
  }
}





async function userMessagestore(event){
  event.preventDefault();
  try {

     if(document.getElementById('uploadBtn').files[0]){

    const token = localStorage.getItem('token');
    const groupId=localStorage.getItem('currentGroupId');
    let file=document.getElementById('uploadBtn').files[0];
    let formData=new FormData();
    formData.append("file", file)
    const headers={
      "Authorization":token,
      'Content-Type':'multipart/form-data'

    }

    const res=await axios.post(`http://localhost:3000/chat/upload/${groupId}`,formData,{headers})

    showfilelink(res.data.userFile);
    socket.emit("file",res.data.userFile.message,res.data.userFile.name,groupId,res.data.userFile.userId)
     }
   
     else
    {
      
    const msg=document.getElementById('message-input').value;
    document.getElementById('message-input').value='';
    const token = localStorage.getItem('token');
    const groupId=localStorage.getItem('currentGroupId');
    const data={message:msg,groupId}
    const res=await axios.post(`http://localhost:3000/chat/sendmessage`,data,{headers:{"Authorization":token}}); 
    const groupMsg=res.data.newMessage;
    showpostmsg(res.data.newMessage)
    socket.emit("message",msg,groupMsg.name,groupId,groupMsg.userId);

    }
    
  } catch (error) {
    console.log(error);

  }
}



function showfilelink(userFile){
  const token = localStorage.getItem('token')
  let currentuser=parseJwt(token);
  const chats=document.getElementById('chat-messages'); 
  let newpara=document.createElement('li');
  let fileLink = document.createElement('a');

  fileLink.href=userFile.message;
  fileLink.innerText="click to see(download)";

  if(userFile.userId == currentuser.userId){
    newpara.appendChild(document.createTextNode(`You:`))
  }

  else{
    newpara.appendChild(document.createTextNode(`${userFile.name}:`))
  }

 newpara.appendChild(fileLink);
 chats.appendChild(newpara)


}




function showpostmsg(newMsg){
  console.log(newMsg);
  const token = localStorage.getItem('token');
  const  currentUser=parseJwt(token);
  const chats=document.getElementById('chat-messages');
  const newPara = document.createElement('li');
  if (newMsg.userId === currentUser.userId) {
    newPara.innerText = `You: ${newMsg.message}`;
  } else {
    newPara.innerText = `${newMsg.name}: ${newMsg.message}`;
  }
  chats.appendChild(newPara);
}
 




