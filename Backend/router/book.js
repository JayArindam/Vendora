const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const authenticateToken = require("./userAuth");

// Add book -- admin only
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied" });
        }

        const book = await Book.create({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language,
        });

        res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update-book", authenticateToken, async(req, res) =>{
    try{
        const{bookid} = req.headers;
        const { id } = req.headers;
        const {url, title, author, price, description, language} = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied" });
        }

        const book = await Book.findByPk(bookid);
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }

        await book.update({url, title, author, price, description, language});

        return res.status(200).json({message:"Book updated successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "An error occurred"})
;    }
})

//delete book --admin
router.delete("/delete-book",authenticateToken, async(req,res)=>{
    try{
        const { id } = req.headers;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied" });
        }
        const {bookid} = req.headers;
        const book = await Book.findByPk(bookid);

        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        await book.destroy();
        return res.status(200).json({message:"Book deleted successfully",});

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});

 //get all books
router.get("/get-all-books",async(req,res)=>{
    try{
        const books = await Book.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'url', 'title', 'author', 'price', 'description', 'language', 'createdAt']
        });
        return res.json({
            success: true, 
            data: books
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
 });

 //get recently added books limit 4
 router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.findAll({
            order: [['createdAt', 'DESC']], // Sort correctly with Sequelize
            limit: 4,  // Get only the latest 4 books
            attributes: ['id', 'url', 'title', 'author', 'price', 'description', 'language', 'createdAt']
        });

        return res.json({
            success: true,
            data: books,
        });

    } catch (error) {
        console.error("Error fetching recent books:", error);
        return res.status(500).json({ success: false, message: "An error occurred" });
    }
});


 //get book by id
 router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id); // Correct way to find by primary key in Sequelize

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        return res.json({
            success: true,
            data: book,
        });

    } catch (error) {
        console.error("Error fetching book by ID:", error);
        return res.status(500).json({ success: false, message: "An error occurred" });
    }
});



module.exports = router;
