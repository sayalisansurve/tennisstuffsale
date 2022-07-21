// const { is } = require('express/lib/request');
const express=require('express');
const mongoose=require('mongoose');
// const Rackets = require('./rackets.model');
const userSchema=new mongoose.Schema({
    user_Id:{
        type:Number,
        integer:true,
        required:true
    },
    
    username:{
        type:String,
        required:true,
        index:{
            unique:true,
        }

    },
    userlogin:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },

    mobile:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        },
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        
    },
    isverified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true,
        
    },
    date:{
        type:Date,
        default:Date.now
    },
    rememberme:{
        type:Boolean,
        default:0
    },
    cart:{
        items:[{
            racketId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Racket',
                required:true
            },
            qty:{
                type:Number,
                required:true
            }
          
        }],
        totalprice:Number,
        
    },
    isSelling:{
        type:Boolean,
        default:false
    }

});

userSchema.methods.addToCart=function(racket){
    let cart=this.cart;
    //  console.log(racket);
    if (cart.items.length==0){ //first time add item to shopping cart
        cart.items.push({racketId:racket._id,qty:1});
        cart.totalprice=racket.i_Price;
        // usernameGlobal.push(cart);        
    }else{  //items exit in cart
        const isExisting=cart.items.findIndex(objInItmes=>{
            return new String(objInItmes.racketId).trim()==new String(racket._id).trim()});
        if(isExisting==-1){ ///not exist push racket with qty and totla price
            cart.items.push({racketId:racket._id,qty:1});
            cart.totalprice+=racket.i_Price;
            // usernameGlobal.push(cart);
        }else{
            existingRacketInCart=cart.items[isExisting];
            existingRacketInCart.qty+=1;
            cart.totalprice+=racket.i_Price;
            // usernameGlobal.push(cart);
        }
        // userGlobal.push(cart);
        // console.log('users.js' + userGlobal);
    }
    // console.log("User AddtoCart"+ cart);
    // console.log('User in schema',this);
    return this.save();
    
}
// ----------Remove Racket from cart
userSchema.methods.removefromCart=function(racket){
    let cart=this.cart;
    // console.log("user.js remvoefromcart" + racket);
    if (cart.items.length==0){ //first time remove item to shopping cart
        // cart.items.push({racketId:racket._id,qty:1});
        // cart.totalprice=racket.i_Price;
        
    }else{  //items exit in cart
        const isExisting=cart.items.findIndex(objInItmes=>{
            return new String(objInItmes.racketId).trim()==new String(racket._id).trim()});
        if(isExisting==-1){ ///not exist push racket with qty and totla price
            // cart.items.push({racketId:racket._id,qty:1});
            // cart.totalprice+=racket.i_Price;
            
        }else{
            existingRacketInCart=cart.items[isExisting];
            if (existingRacketInCart.qty<=1){
                cart.items.splice(isExisting,1);
                
            }else{
                existingRacketInCart.qty-=1;
                
            }
            
                cart.totalprice-=racket.i_Price;
            if (cart.totalprice<=0){
                cart.totalprice=0;
            }
        }
        return this.save();
     
    
    
}
}


// racketwise cartqty
userSchema.methods.cartitemqty=function(racket){
    let cart=this.cart;
    let qty=0;
    // console.log("user.js remvoefromcart" + racket);
    if (cart.items.length==0){ //first time remove item to shopping cart
        // cart.items.push({racketId:racket._id,qty:1});
        // cart.totalprice=racket.i_Price;
        
    }else{  //items exit in cart
        const isExisting=cart.items.findIndex(objInItmes=>{
            return new String(objInItmes.racketId).trim()==new String(racket.id).trim()});
        if(isExisting==-1){ ///not exist push racket with qty and totla price
            // cart.items.push({racketId:racket._id,qty:1});
            // cart.totalprice+=racket.i_Price;
            
        }else{
            
            qty=cart.items[isExisting].qty;
          
        }
        console.log('user.js'+ qty);
        return qty;
    
    
}
}



// -------------------------

module.exports=mongoose.model('User',userSchema);