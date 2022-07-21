const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const mfSchema=mongoose.Schema({
    i_Mnf_Id:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    c_Mnf:{
        type:String,
        required:true
    }    
    
})

// we need collection
const Manufacturers=mongoose.model("manufacturers",mfSchema);

module.exports=Manufacturers;