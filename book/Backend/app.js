const express = require('express');
const app = express();
require("./conn/conn");
require("./models/associations");

require('dotenv').config();
const User = require("./router/user");
const Book = require("./router/book");
app.use(express.json());

app.use("/api/v1", User);
app.use("/api/v1",Book);

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server running on ${process.env.PORT}`);
} )