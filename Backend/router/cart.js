const router = require("express").Router();
const authenticateToken = require("./userAuth");
const Cart = require("../models/cart");
const Book = require('../models/Book');


// PUT: Add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;
        const { id: userId } = req.headers;

        // Check if already in cart
        const existing = await Cart.findOne({ where: { userId, bookId: bookid } });

        if (existing) {
            return res.json({ status: "success", message: "Book already in cart" });
        }

        // Add to cart
        await Cart.create({ userId, bookId: bookid });

        return res.json({ status: "success", message: "Book added to cart" });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove book from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const userId = req.headers.id;

        const deleted = await Cart.destroy({
            where: { userId, bookId: bookid },
        });

        if (deleted === 0) {
            return res.status(404).json({ message: "Book not found in cart" });
        }

        return res.json({ status: "Success", message: "Book removed from cart" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get user cart items
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Book, as: "book" }], // Use `as: "book"` as per your association
            order: [["createdAt", "DESC"]],
        });

        res.json({ status: "Success", data: cartItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
