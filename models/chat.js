const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const Message=sequelize.define('message',{
    id:
    {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    message:Sequelize.STRING,
    name:Sequelize.STRING,
    type:Sequelize.STRING
})

module.exports=Message;