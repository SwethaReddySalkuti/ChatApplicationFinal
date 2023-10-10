const express=require('express');

const bodyParser=require('body-parser');   // parses string based client request into js Object
const cors=require('cors');  // allows restricted resources on a web page to be accessed from another domain
const http =require ("http");
const socketIO=require('socket.io')

const app=express();
const server = http.createServer(app);
const io= socketIO(server,{ cors : { origin : '*'}});  // persistent connection between socket & client 
//instead of many requets ,only one connection

io.on("connection",(socket)=>{
    console.log('Socket.io Connected');
    socket.on("message",(msg,userName,groupId,userId)=>{
        socket.broadcast.emit("message",msg,userName,groupId,userId)       //except the one being called
    });
    socket.on("file",(message,userName,groupId,userId)=>{
        socket.broadcast.emit("file",message,userName,groupId,userId)

    })
})


require('dotenv').config()

const resetPasswordRoutes = require('./routes/resetpassword');
const sequelize=require('./utils/database');
const userRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');
const groupRoutes=require('./routes/group')
const User=require('./models/user');
const Message=require('./models/chat');
const Group=require('./models/group');
const Forgotpassword = require('./models/forgotpassword');
const UserGroup=require('./models/usergroup');

app.use(cors({
    origin:'*'  // any other domain can access the resources
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));    // only string and array type in key-value pairs

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);
app.use(groupRoutes);
app.use('/password', resetPasswordRoutes);


// Associations

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User,{through:UserGroup});
User.belongsToMany(Group,{through:UserGroup});            // tables which contains only foriegn keys

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync(
    //  {force : true}
)
.then((res)=>{
    server.listen(process.env.PORT,()=>console.log('Server Started'))
})
.catch(err=>console.log(err));












