const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/user');
const bcrypt=require('bcrypt');


router.get('/',(req,res,next)=>{
  User.find().select('email _id').exec().then(docs =>{
     const response={
       count:docs.length,
       user:docs.map(doc =>{
           return{
               email:doc.email,
               _id:doc.id,
               request:{
                   type:'GET',
                   url: req.protocol + '://' + req.headers.host + req.url + 'user/' + doc._id
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

router.post('/signup',(req,res,next)=>{
  bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({error:err});
        }
        else{
            const user= new User({
                _id:new mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash
        });
        user.save().then(result =>{
          console.log(result);
          res.status(201).json({
            message:'User Created'
          })
        }).catch(err =>{
            return res.status(500).json({error:err});
        });
    }
  })
})

 router.delete('/:userId',(req,res,next)=>{
  const id=req.params.userId;
     User.findByIdAndRemove({_id:id}).exec().then(result=>{
      res.status(200).json({
        message:'user deleted'
      })
     }).catch(err=>{
      return res.status(500).json({error:err});
     })
 })

module.exports=router;