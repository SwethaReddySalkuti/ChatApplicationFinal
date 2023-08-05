
async function createUser(e){
    e.preventDefault();
   try {
     const user={
         name:e.target.name.value,
         email:e.target.email.value,
         phonenumber:e.target.phonenumber.value,
         password:e.target.password.value
     }
     
         document.getElementById('nameid').value='';
         document.getElementById('emailid').value='';
         document.getElementById('phoneid').value='';
         document.getElementById('password').value='';
     const res= await axios.post('http://localhost:3000/user/signup',user);
     console.log(res);
     if(res.status===200){
         alert(res.data.message)
         window.location.href='../Login/login.html'
     }
      
    } catch (error) {
        alert(error.response.data.message);
        console.log(error);
        document.body.innerHTML+=`<div style="color: red;text-align: center;">
                                    <h3>${error}</h3>
                              </div>`
    }
}