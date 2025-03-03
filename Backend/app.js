const express = require('express');
const app = express();
require("./conn/conn");
require("./models/associations");

require('dotenv').config();
const User = require("./router/user");
const Book = require("./router/book");
const Cart = require("./router/cart")
app.use(express.json());

app.use("/api/v1", User);
app.use("/api/v1",Book);
app.use("/api/v1", Cart);

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server running on ${process.env.PORT}`);
} )