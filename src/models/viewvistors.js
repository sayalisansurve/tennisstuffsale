
const express=require('express');
const mongoose=require('mongoose');
// const validator=require('validator');
const viewVistorSchema=mongoose.Schema({
    
    i_vistor_count:
    {
        type:Number,
        integer:true,
        required:true,
        
        
    },
    
    
    lastvisitdate:{
        type:Date,
        default:Date.now
        
    }
    });



// we need collection
const viewVistors=mongoose.model("ViewVisitor",viewVistorSchema);

module.exports=viewVistors;