const express= require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/products');
router.get('/',(req,res,next)=>{
   Product.find().select('name price _id').exec().then(docs =>{
      const response={
        count:docs.length,
        products:docs.map(doc =>{
            return{
                name:doc.name,
                price:doc.price,
                _id:doc.id,
                request:{
                    type:'GET',
                    url: req.protocol + '://' + req.headers.host + req.url + 'products/' + doc._id
                 }
            }
        })
      }
      res.status(200).json(response);
   }).catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
   });
});
router.post('/',(req,res,next)=>{
     const product= new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
     });
     product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Created product Successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url: req.protocol + '://' + req.headers.host + req.url + 'products/' + result._id
                }
            }
         });
     })
     .catch(err=>{console.log(err)
        req.status(500).json({error:err});
    });
    
});
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
   Product.findById(id).select('-__v').exec().then(doc=>{
    console.log("from database",doc);
    if(doc)
    {
        res.status(200).json(doc);
    }
    else{
        res.status(404).json({
            message:'No valid entry found'
        })
    }
   
   })
   .catch(err=>{
    console.log(err);
     req.status(500).json({error:err});
   })
})


router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateObject = req.body;
    Product.findOneAndUpdate({ _id: id }, { $set: updateObject })
      .exec()
      .then(result => {
        res
          .status(200)
          .json({ message: "Product updated succesfully", request:{
            type:'GET',
            url: req.protocol + '://' + req.headers.host + '/products'+ req.url 
          } });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
        Product.findByIdAndRemove({ _id: id }).exec().then(
            result=>{res.status(200).json(result)}
        )
        .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
});


module.exports=router;