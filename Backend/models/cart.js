const { DataTypes } = require('sequelize');
const sequelize = require('../conn/conn');

const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: true
});

module.exports = Cart;
