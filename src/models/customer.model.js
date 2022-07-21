const express=require('express');
const mongoose=require('mongoose');

// /Define Mongo mongoose.Schema
var customerSchema=new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    address:String,
    desc:String

});

// we need collection
const Customers=mongoose.model("Customer",customerSchema);

module.exports=Customers;