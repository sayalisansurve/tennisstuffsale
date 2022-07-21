const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const seriesSchema=mongoose.Schema({
    i_seriesId:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    c_series:{
        type:String,
        required:true
    }    
    
})

// we need collection
const Series=mongoose.model("series",seriesSchema);

module.exports=Series;