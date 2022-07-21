
const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const productsSchema=mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        trim:true
        
    },
    pheader:{
        type:String
    },
    
    psubheader:{
        type:String
    },
    mrp:
    {
        type:Number,
        required:true
        // validate(value){
        //     if (!validator.isEmail(value)){
        //         throw new Error("Invalid Email Id")
        //     }
        // }
    },
    price:
    {
        type:Number,
        required:true
        // validate(value){
        //     if (!validator.isEmail(value)){
        //         throw new Error("Invalid Email Id")
        //     }
        // }
    },
    discount:{
        type:Number
    },
    gripsize:{
        type:String
    },
    stringtype:{
        type:String
    },
    description:
    {
        type:String,
        // required:true,
        // minLength:10
    },
    rating:{
        type:String,
        
        },
    pimage1:{
        type:String
    },
    des:{
        type:String
    }, 
    date:{
        type:Date,
        default:Date.now
    }
    
})

// we need collection
const Products=mongoose.model("Product",productsSchema);

module.exports=Products;