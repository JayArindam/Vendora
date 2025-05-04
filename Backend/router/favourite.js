const router = require("express").Router();
const authenticateToken = require("./userAuth");

const User = require("../models/user");
const Book = require("../models/book");
const Favourite = require("../models/favourite");

//add book to favourite
router.put("/add-to-fav", authenticateToken, async(req, res) =>{
    try{
        const {bookid, id} = req.headers;

        const book = await Book.findByPk(bookid);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        const existingFavourite = await Favourite.findOne({
            where: { userId: id, bookId: bookid }
        });
        
        if(existingFavourite){
            return res.status(200).json({message: "Book is already in favourites"});
        }

        await Favourite.create({userId: id, bookId: bookid});

        return res.status(200).json({message: "Book added to favourites"});
    }
    catch(error){
        res.status(500).json({message: "Internal Server error"});
    }
})

//delete book from favourite 
router.delete("/delete-from-fav", authenticateToken, async (req, res) =>{
    try{
        const{bookid, id} = req.headers; 

        const deleted = await Favourite.destroy({
            where: {userId : id, bookId : bookid}
        });
        if(!deleted){
            return res.status(404).json({message: "Book not in favourites"});
        }

        return res.status(200).json({message : "Book removed from favourites"});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal Server error"});
    }
});


// get favourites of a user 
router.get("/get-favs", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        const favourites = await Favourite.findAll({
            where: { userId: id },
            include: [{ model: Book, as: 'book' }]  // Use 'book' here as the alias for Book
        });

        if (favourites.length === 0) {
            return res.status(404).json({ message: "No favorites found" });
        }

        const books = favourites.map(fav => fav.book);  // Access 'book' based on the alias

        return res.json({
            status: "Success",
            data: books
        });
    } catch (error) {
        console.error("Error in get-favs route:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});
module.exports = router;