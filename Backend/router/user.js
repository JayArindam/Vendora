const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth");
require("dotenv").config();

const validator = require('validator');

router.post("/sign-up", async (req, res) => {
    try {
      const { username, email, password, address } = req.body;
  
      // Check if username is not empty or just whitespace
      if (!username || username.trim().length < 4) {
        return res.status(400).json({ message: "Username must be at least 4 characters and not empty or just spaces" });
      }
  
      // Check if the username is only whitespace
      const trimmedUsername = username.trim();
      if (trimmedUsername === "") {
        return res.status(400).json({ message: "Username cannot be empty or just spaces" });
      }
  
      // Email format validation
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      // Password length and strength check
      if (password.length < 6) {
        return res.status(400).json({ message: "Password should be at least 6 characters long" });
      }
  
      // Optional: add strength rule (contains letter and number)
      const passwordStrong = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
      if (!passwordStrong.test(password)) {
        return res.status(400).json({ message: "Password should contain letters and numbers" });
      }
  
      // Check for existing email
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() }
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashPass = await bcrypt.hash(password, 10);
  
      await User.create({
        username: trimmedUsername,
        email: email.toLowerCase(),
        password: hashPass,
        address
      });
  
      return res.status(200).json({ message: "Sign Up Successful" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request body:", req.body);

        if(!email){
            return res.status(400).json({message: "Email is required"});
        }

        const existingUser = await User.findOne({ where: {email} });
        console.log("User found:", existingUser);

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const authClaims = { id: existingUser.id, role: existingUser.role };
        console.log("Auth claims:", authClaims);

        const token = jwt.sign({ authClaims }, process.env.tokenSecret, { expiresIn: "10d" });
        console.log("Generated token:", token);

        res.status(200).json({ id: existingUser.id, role: existingUser.role, token });

    } catch (error) {
        console.error("Login error:", error.message, error.stack);
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