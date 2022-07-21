const Racket=require('../src/models/rackets.model');
const Cart=require('../src/models/cart');
const async = require('hbs/lib/async');


exports.addToCart= async(req,res,next)=>{
        // console.log('addtocart' + req.user);
        console.log (req.body.id_cart);
        Racket.findById(req.body.id_cart)
        .then(racket=>{
            //  console.log(req.user);
            req.user.addToCart(racket)
                .then(result=>{
                    // usernameGlobal=result;
                    // console.log('shocart' +usernameGlobal);
                    // res.redirect('/productdetails/' +req.body.id_cart);
                })
                .catch(err=>console.log(err));
        })

    


    // let data=await racket.findById(req.body.id_cart);
    // // console.log(data);
    //     req.user.addToCart(data)
    //         .then((racket)=>{
    //             res.redirect('/cart');
    //         }).catch(err=>console.log(err));
        
    
};


// -----Remove Racket from cart

exports.removefromCart= async(req,res,next)=>{
    // console.log('addtocart' + req.user);
    // console.log(req.body.id_remvoe_cart);
    //document.getElementById('cartcount')
    Racket.findById(req.body.id_remvoe_cart)
    .then(racket=>{
        // console.log(req.user);
        //console.log( req.user.cart[0].items);
        var coutQty=0;
        req.user.removefromCart(racket)
            .then(result=>{
                for (i = 0; i < req.user.cart.items.length; i++) {

                    coutQty = coutQty + req.user.cart.items[i].qty;
                }
                cartItemCount=coutQty;
                req.user
                .populate('cart.items.racketId')
                .then(user => {
                //console.log(cartItemCount);
                res.render('fileshoppingcart', { cart: user.cart, title: 'Shopping Cart Details', path: '/cart', user: user, username: userGlobal, cartItemCount: cartItemCount, verified: true });
            // endif
        })
        .catch(err => console.log(err));
            })
            .catch(err=>console.log(err));
    })

};

// find qty user racket wise

// exports.cartitemqty= async(req,res,next)=>{
//     // console.log('addtocart' + req.user);
//     // console.log(req.body.id_remvoe_cart);
//     Racket.findById(req.body.id)
//     .then(racket=>{
//         // console.log(req.user);
//         req.user.cartitemqty(racket)
//             .then(result=>{

//                 // usernameGlobal=result;
//                 // console.log('shocart' +usernameGlobal);
//                 // res.redirect('/productdetails/'+req.body.id_remvoe_cart);
//             })
//             .catch(err=>console.log(err));
//     })

// };


// ----End