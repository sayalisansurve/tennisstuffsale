const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const deliverystatusSchema=mongoose.Schema({
    i_Delivery_Status:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    c_Delivery_Status:{
        type:String,
        required:true
    }    
    
})

// we need collection
const Deliverystatus=mongoose.model("deliverystatus",deliverystatusSchema);

module.exports=Deliverystatus;