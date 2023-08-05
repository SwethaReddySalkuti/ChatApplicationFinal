const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const Group=sequelize.define('group',{
    id:
    {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    groupname:Sequelize.STRING,
    createdBy:Sequelize.INTEGER
});

module.exports=Group;
