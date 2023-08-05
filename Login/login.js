console.log('js connected');

async function loginUser(e){
    e.preventDefault();
    try {
        const loginUser={
            email:e.target.email.value,
            password:e.target.password.value
        }

        document.getElementById('emailid').value='';
        document.getElementById('password').value='';
        const res= await axios.post('http://localhost:3000/user/login',loginUser);
        if(res.status===200){
            localStorage.setItem('token',res.data.token)
            alert(res.data.message);
            window.location.href="../Chatapp/chatapp.html"
        }
    
        
    } catch (error) {
        alert(error.response.data.message);
        document.body.innerHTML+=`<div style="color: red;text-align: center;">
                                    <h3>${error}</h3>
                              </div>`
        
    }
}