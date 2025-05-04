const User = require("./user");
const Book = require("./book");
const Order = require("./order");
const Favourite = require("./favourite");
const Cart = require("./cart");
const UserOrders = require("./UserOrders");

// Order links
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// Favourite links
User.hasMany(Favourite, { foreignKey: "userId", as: "favourites" });
Book.hasMany(Favourite, { foreignKey: "bookId", onDelete: 'CASCADE' });
Favourite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favourite.belongsTo(Book, { foreignKey: "bookId", onDelete: 'CASCADE', as: "book" });

// Cart links
User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Book.hasMany(Cart, { foreignKey: "bookId" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
Cart.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// UserOrders links
User.hasMany(UserOrders, { foreignKey: "userId", as: "userOrders" });
Book.hasMany(UserOrders, { foreignKey: "bookId" });
UserOrders.belongsTo(User, { foreignKey: "userId", as: "user" });
UserOrders.belongsTo(Book, { foreignKey: "bookId", as: "book" });

module.exports = {
    User,
    Book,
    Order,
    Favourite,
    Cart,
    UserOrders
};
