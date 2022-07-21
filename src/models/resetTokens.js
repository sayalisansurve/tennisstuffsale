const mongoose=require('mongoose');
const resetTokens=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    expired_at:{
        type:Date,
        default:Date.now,
        expires: 600,

    }
});
;module.exports=mongoose.model('resetTokens',resetTokens);