const express=require('express');
const app=express();
const morgan=require('morgan');
const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/order');
const userRoutes=require('./api/routes/user');
require('dotenv').config();
app.use(morgan('dev'));
var mongoose = require('mongoose');
const mongoAtlasUri =
  `mongodb://${process.env.ID}:${process.env.PASS}@ac-jjjvutl-shard-00-00.euf6xtw.mongodb.net:27017,ac-jjjvutl-shard-00-01.euf6xtw.mongodb.net:27017,ac-jjjvutl-shard-00-02.euf6xtw.mongodb.net:27017/?ssl=true&replicaSet=atlas-v2dsg0-shard-0&authSource=admin&retryWrites=true&w=majority`;
  try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
  } catch (e) {
    console.log("could not connect");
  }

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        "Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization"
    )
    if(req.method==="OPTIONS")
    {
        res.header('Access-Control-Allow-Methods','PUT, PATCH,GET,POST ,DELETE');
        res.status(200).json({});
    }
    next();
})

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use((req,res,next)=>{
    const error= new Error('Not found');
    error.status=400;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;