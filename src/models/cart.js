var cart=null;
module.exports=class Cart{
    static save(racket){
        
        if (cart){ //cart is not null
            const existingRacketIndex=cart.rackets.findIndex(p=>p.id==racket.id);//to check racket is existing
            console.log('existingRacketIndex:',existingRacketIndex);
            if (existingRacketIndex>=0){ //exist in cart already
                const existingRacket=cart.rackets[existingRacketIndex];
                const existingqty=existingRacket.qty;
                existingRacket.qty+=existingqty;
                cart.totalPrice+=racket.i_Price;
                cart.qty+=1;
            }else{
                racket.qty=1;
                cart.rackets.push(racket);
                cart.totalPrice+=racket.i_Price;
                cart.qty=1;

            }
            // console.log(cart);

        }else{
            cart={rackets:[],qty:0,totalPrice:0};
            // racket.qty=1;
            cart.rackets.push(racket);
            cart.totalPrice=racket.i_Price;
            cart.qty=1;
            // console.log(cart);

        }
    }

    static getCart(){
        return cart;
    }
}