const express = require('express');
const app = express();
const cors=require("cors");
require("./conn/conn");
require("./models/associations");
require('dotenv').config();

const User = require("./router/user");
const Book = require("./router/book");
const Cart = require("./router/cart");
const Favourite = require("./router/favourite");
const Order = require("./router/order");
app.use(cors());
app.use(express.json());

app.use("/api/v1", User);
app.use("/api/v1",Book);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);


app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server running on ${process.env.PORT}`);
} )