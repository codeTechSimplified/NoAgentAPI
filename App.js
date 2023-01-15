const express = require('express');

const app = express();

// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:"OK"
//     })
// })


const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const productRoutes = require("./api/routes/products");
// const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/product');
const rentRoutes = require('./api/routes/rent');
const homeRoutes = require('./api/routes/home');
const landRoutes = require('./api/routes/land');










const uri = 'mongodb+srv://Laxman:34522484@cluster0.qod7ejq.mongodb.net/veryrealnoagent?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
})
.then((res)=>{
    console.log("DB connection Done");

})
.catch((err)=>{
    console.log("err in connecting DB");
})



app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/product", productRoutes);
app.use("/rent", rentRoutes);
app.use("/home",homeRoutes);
app.use("/land",landRoutes);



app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;


