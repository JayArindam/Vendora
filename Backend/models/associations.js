const User = require("./user");
const Book = require("./book");
const Order = require("./order");

Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.belongsTo(Book, { foreignKey: "bookId", as: "book" });

User.belongsToMany(Book, { through: 'Favorites', as: 'favoriteBooks' });
User.belongsToMany(Book, { through: 'Cart', as: 'cartItems' });
User.belongsToMany(Book, { through: 'UserOrders', as: 'userOrders' }); 

module.exports = { User, Book, Order };