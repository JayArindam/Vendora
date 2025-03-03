const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("./userAuth");

//put book to cart
router.put("/add-to-cart",authenticateToken, async(req,res)=>{
    try{
        const {bookid, id} = req.headers;

        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const cart = user.cart ||[];
        if(cart.includes(bookid)){
            return res.json({status: "success", message: "Book already in cart"});
        }
        cart.push(bookid);
        await user.update({cart});

        return res.json({status:"Success", message:"Book added to cart"});
    }catch(error){
        console.log(error);
        return res.status(500).json({messsage:"An error occurred"});
    }
});


//remove book from cart
router.put("/remove-from-cart/:bookid",authenticateToken, async(req,res)=>{
    try{
        const {bookid} = req.params;
        const {id} = req.headers;

        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({message :"User not found"});
        }
        const cart = user.cart || [];
        const updatedCart = cart.filter((item) => item !== bookid);

        await user.update({cart: updatedCart});

        return res.json({status:"Success", message:"Book removed from cart",});
    }catch(error){
        console.log(error);
        return res.status(500).json({messsage:"An error occurred"});
    }
});

//get cart of a particular user
router.get("/get-user-cart",authenticateToken, async(req,res)=>{
    try{
        const {id} = req.headers;

        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const cart = user.cart ? [...user.cart].reverse() : [];

        return res.json({status:"Success", data:cart});
    }catch(error){
        console.log(error);
        return res.status(500).json({messsage:"An error occurred"});
    }
});

module.exports=router;