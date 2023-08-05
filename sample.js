function add()
{
    let li =document.createElement('li');
    li.textContent="groupname";
    li.setAttribute('groupId','1');
    li.setAttribute('createdBy','2')
 


     let childNode= `<button class="btn btn-success" onclick="addMembers">AddMember</button>
      <button class="btn btn-info" onclick="RemoveMember">RemoveMember</button>
      <button class="btn btn-warning" onclick="changeAdmin">ChangeAdmin</button>
      <button class="btn btn-danger" onclick="removeGroup">RemoveGroup</button>`
      let addButton=document.createElement('button');
      addButton.className="btn-same";
      addButton.textContent="AddMember";
      addButton.addEventListener('click',addMembers);

      let delButton=document.createElement('button');
      delButton.textContent="RemoveMember";
      delButton.className="btn-same";
      delButton.addEventListener('click',removeMember);

      let adminButton=document.createElement('button');
      adminButton.className="btn-same"
      adminButton.textContent="ChangeAdmin";
      adminButton.addEventListener('click',changeAdmin)


      let delGroupButton=document.createElement('button')
      delGroupButton.textContent="OpenChat";
      delGroupButton.addEventListener('click','')

   
     let openChatbutton=document.createElement('button');
     openChatbutton.textContent="Openchat";
     openChatbutton.onclick="groupchatPage";

     li.appendChild(openChatbutton)


  

    document.getElementById('allgrouplist').innerHTML='';
    document.getElementById('allgrouplist').appendChild(li)
}