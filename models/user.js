const{DataTypes} = require('sequelize');
const sequelize = require("../conn/conn");

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    username:{type: DataTypes.STRING,allowNull: false, unique: true}, 
    email: {type: DataTypes.STRING,allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false}, 
    address: {type: DataTypes.STRING, allowNull: false}, 
    avatar: {
        type: DataTypes.STRING,
        defaultValue: "https://thenounproject.com/browse/icons/term/default-user/"
    },
    role: {type: DataTypes.ENUM("user", "admin"), defaultValue: "user"},
},{timestamps: true});


module.exports = User;