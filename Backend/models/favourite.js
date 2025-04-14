const { DataTypes } = require('sequelize');
const sequelize = require("../conn/conn");

const Favourite = sequelize.define("Favourite", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

module.exports = Favourite;
