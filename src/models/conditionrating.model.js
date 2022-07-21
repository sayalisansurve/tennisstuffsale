const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const condratingSchema=mongoose.Schema({
    i_condrating_Id:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    i_Cond_Rating:{
        type:Number,
        integer:true,
        required:true
    }    ,
    c_condrating_image:{
        type:String,
        required:true
    },
    c_CondName:{
        type:String,
        // required:true
    }
})

// we need collection
const Conditionrating=mongoose.model("conditionratings",condratingSchema);

module.exports=Conditionrating;