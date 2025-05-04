const { DataTypes } = require("sequelize");
const sequelize = require("../conn/conn");

const Book = sequelize.define("Book", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    language: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

Book.associate = (models) => {
    Book.hasMany(models.Cart, { foreignKey: "bookId" });
};

module.exports = Book;
