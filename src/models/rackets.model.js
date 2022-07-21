
const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const racketSchema=mongoose.Schema({
    i_Rkt_Id:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    c_Rkt_Name:{
        type:String,
        required:true
    },
    
    c_Rkt_Desc:{
        type:String
        
    },
    i_Mnf_Id:
    {
        type:Number,
        integer:true,
        ref:'manufacturers'
        // required:true
        // validate(value){
        //     if (!validator.isEmail(value)){
        //         throw new Error("Invalid Email Id")
        //     }
        // }
    },
    i_seriesId:
    {
        type:Number,
        integer:true,
        ref:'series'
        // validate(value){
        //     if (!validator.isEmail(value)){
        //         throw new Error("Invalid Email Id")
        //     }
        // }
    },
    i_HeadSize:{
        type:Number,
        integer:true,
    },
    i_Weight_Un_St:{
        type:Number,
        integer:true
    },
    i_Price:{
        type:Number,
        integer:true
    },
    i_Length:
    {
        type:Number,
        // required:true,
        // minLength:10
    },
    i_condrating_Id:{
        type:Number,
        integer:true
        
        },
    i_GripSize:{
        type:Number,
        integer:true
       
    },
    desi_Ver_Status:{
        type:Number,
        integer:true
       
    }, 
    i_Sale_Statuse:{
        type:Number,
        integer:true
    
    },
    i_Delivery_Status:{
        type:Number,
        integer:true
    },
    c_FolderName:{
        type:String
    },
    c_mainImageName:{
        type:String
    },
    i_Raket_Model_Id:{
        type:Number,
        integer:true
    },
    i_Sale_Status:{
        type:Number,
        integer:true
    },
    i_Ver_Status:{
        type:Number,
        integer:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        
    }
})



// we need collection
const Rackets=mongoose.model("Racket",racketSchema);

module.exports=Rackets;