const { DataTypes } = require('sequelize');
const sequelize = require("../conn/conn");

const UserOrders = sequelize.define("UserOrders", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { timestamps: true });

module.exports = UserOrders;
