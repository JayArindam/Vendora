const { DataTypes } = require('sequelize');
const sequelize = require("../conn/conn");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
        type: DataTypes.ENUM("Order Placed", "Out for delivery", "Delivered", "Cancelled"),
        defaultValue: "Order Placed"
    }
}, { timestamps: true });

module.exports = Order;
