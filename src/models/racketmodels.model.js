const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const racketmodelSchema=mongoose.Schema({
    i_Raket_Model_Id:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    c_Raket_Model:{
        type:String,
        required:true
    }    
    
})

// we need collection
const RacketModels=mongoose.model("racketmodels",racketmodelSchema);

module.exports=RacketModels;