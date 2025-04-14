const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth");
require("dotenv").config();


router.post("/sign-up", async(req, res) =>{
    try{
        const {username, email, password, address} = req.body;
        
        if(username.length < 4){
            return res
            .status(400)
            .json({message: "Length should be greater than 3"});
        }

        if(password.length <= 5){
            return res
            .status(400)
            .json({message: "Password length should be more than 6 characters"});
        }

        const existingUser = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email, 
            password: hashPass, 
            address
        });
        
        return res
        .status(200)
        .json({message: "Sign Up Successful"});

    } catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
})
 
router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email){
            return res.status(400).json({message: "Email is required"});
        }
        const existingUser = await User.findOne({ where: {email} });

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const authClaims = {id: existingUser.id, role: existingUser.role};
        const token = jwt.sign({authClaims}, process.env.tokenSecret, {expiresIn:"10d"});

        res.status(200).json({ id: existingUser.id, role: existingUser.role, token});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/get-user-information", authenticateToken, async(req, res)=>{
    try{
        const{id} = req.headers;
        if(!id){
            return res.status(400).json({message: "User Id required"})
        }

        const data = await User.findByPk(id, {
            attributes: {exclude: ['password']}
        });
        if(!data){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json(data);
    }catch(error){
        console.error(error);
        res.status(500).json({message : "Internal Server error"});

    }
})

router.put("/update-address", authenticateToken, async(req, res) =>{
    try{
        const {id} = req.headers;
        if(!id){
            return res.status(400).json({message: "User Id required"});
        }

        const {address} = req.body;
        if(!address){
            return res.status(400).json({message: "Address is required"});
        }

        const user = await User.findByPk(id);
        if(!user){
            return res.status(400).json({mesaage: "User not found"})
        }

        await user.update({address});
        return res.status(200).json({message: "Address updated successfully"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
})

module.exports = router;