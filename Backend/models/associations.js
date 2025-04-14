const User = require("./user");
const Book = require("./book");
const Order = require("./order");
const Favourite = require("./favourite");
const Cart = require("./cart");
const UserOrders = require("./UserOrders");

// Order links
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// Favourite
User.hasMany(Favourite, { foreignKey: "userId", as: "favourites" });
Book.hasMany(Favourite, { foreignKey: "bookId", onDelete: 'CASCADE' });
Favourite.belongsTo(User, { foreignKey: "userId" });
Favourite.belongsTo(Book, { foreignKey: "bookId", onDelete: 'CASCADE' });

// Cart
User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Book.hasMany(Cart, { foreignKey: "bookId" });
Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Book, { foreignKey: "bookId" });

// UserOrders
User.hasMany(UserOrders, { foreignKey: "userId", as: "userOrders" });
Book.hasMany(UserOrders, { foreignKey: "bookId" });
UserOrders.belongsTo(User, { foreignKey: "userId" });
UserOrders.belongsTo(Book, { foreignKey: "bookId" });

module.exports = {
    User,
    Book,
    Order,
    Favourite,
    Cart,
    UserOrders
};
