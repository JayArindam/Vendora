const router = require("express").Router();
const authenticateToken = require("./userAuth");
const Book = require("../models/book");
const Cart = require("../models/cart");
const Order = require("../models/order");
const User = require("../models/user");

// Place Order Route
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        for (const orderData of order) {
            const book = await Book.findByPk(orderData.book.id);

            if (!book) {
                return res.status(404).json({ message: `Book with ID ${orderData.id} not found` });
            }

            // Creating the order with default status
            await Order.create({
                userId: id,
                bookId: orderData.book.id
            });

            await Cart.destroy({
                where: {
                    userId: id,
                    bookId: orderData.book.id
                }
            });
        }
        return res.json({
            status: "Success",
            message: "Order Placed Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get Order History Route
router.get("/order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const orders = await Order.findAll({
            where: { userId: id },
            include: {
                model: Book,
                attributes: ["id", "title", "author", "price", "url", "description", "language"],
                as: "book"
            },
            order: [['createdAt', 'DESC']]
        });

        const formattedOrders = orders.map(order => ({
            orderId: order.id,
            book: order.book,
            status: order.status,
            createdAt: order.createdAt
        }));

        return res.json({
            status: "success",
            data: formattedOrders
        });
    } catch (error) {
        console.error("Error fetching order history: ", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const allOrders = await Order.findAll({
            include: [
                {
                    model: Book,
                    attributes: [
                        "id", "title", "author", "price", "url", "description", "language"
                    ],
                    as: "book"
                },
                {
                    model: User,
                    attributes: ["id", "username", "email", "address"],
                    as: "user"
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const formattedOrders = allOrders.map(order => ({
            orderId: order.id,
            createdAt: order.createdAt,
            user: order.user,
            book: order.book,
            status: order.status // optional, only if you added it in the model
        }));

        return res.json({
            status: "success",
            data: formattedOrders
        });
    } catch (error) {
        console.error("Error fetching all orders: ", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


// Update Order Status Route (For Admin use)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();

        return res.json({
            status: "success",
            message: "Status updated successfully",
        });
    } catch (error) {
        console.error("Error updating status: ", error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
