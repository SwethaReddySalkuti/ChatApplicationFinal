const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const User=sequelize.define('user',{

    id:
    {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    name:
    {
        type:Sequelize.STRING,
        allowNull:false
    },
    email:
    {
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,

    },
    phonenumber:
    {
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:
    {
     type:Sequelize.STRING,
     allowNull:false   
    }
});


module.exports=User;


