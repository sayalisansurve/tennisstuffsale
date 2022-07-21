const express=require('express');
const async = require('hbs/lib/async');
// const User=require('../src/models/users')
// var localStore = require('local-storage');
const Mfmodel = require('../src/models/manufacture.model')
const racketmodel = require('../src/models/rackets.model');
const { redirect, json } = require('express/lib/response');


exports.removesearch=async(req,res,next)=>{
    var data = await racketmodel.find();
    const mfresult = await Mfmodel.find({});
        icount =1;
        if (req.user==null||req.user==undefined){
            res.render("index", { images: data, mf: mfresult,verified:true });
        }else{
            // console.log('mainpage ' + req.user);
        res.render("index", { images: data, mf: mfresult,user:req.user,username:userGlobal,cartItemCount:cartItemCount,verified:req.user.isverified });
        // res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified, Error: 'Invalid token or token expired' });

        }
    
};

exports.getsearch=async (req,res,next)=>{
    // let checkMnf= req.body.chk_mnf_2;
    // console.log('inside search ' +req.body.txt_hsr_from  );
    var searchcondition= [];
    var chkmnf=req.body.chk_mnf;
    // var chkiVerStatusbyUs=0;
    
    
    
    // console.log(Boolean(req.body.chk_i_Ver_Status_byUs));
    if (chkmnf!=null||chkmnf!=undefined){
        for (i=0;i<chkmnf.length;i++){
            searchcondition.push(   parseInt( chkmnf[i]))
        }
    }
    
    // console.log(searchcondition);
    // // searchcondition="{$and:[" + searchcondition+ "]}";
    // // searchcondition={'i_Mnf_Id':}
    // // searchcondition=[{i_Mnf_Id:2},{i_Mnf_Id:3}];
    var mnf0= searchcondition[0];
    // console.log(searchcondition);
    var mnf1=searchcondition[1];
    var mnf2=searchcondition[2];
    var mnf3=searchcondition[3];
    var mnf4=searchcondition[4];
    var mnf5=searchcondition[5];
    var mnf6=searchcondition[6];
    var mnf7=searchcondition[7];
    var mnf8=searchcondition[8];
    var mnf9=searchcondition[9];
    var mnf10=searchcondition[10];
    // head size
    var txthsrfrom=0;
    var txthsrto=100000;

    // price
    var txtpricefrom=0;
    var txtpriceto=100000;

    //length
    var txtlengthfrom=0;
    var txtlengthto=100000;

    //Racket Conditon
    var txtracketcondfrom=0;
    var txtracketcondto=100000;

    //Grip Size
    var txtracketGripfrom=0;
    var txtracketGripto=100000;

    //verify by us
    var chkiVerStatusbyUs=0;
    var chkiVerStatus_notverify=0;
    if (Boolean(req.body.chk_i_Ver_Status_byUs)==true){
        chkiVerStatusbyUs=1;
    }else{
        chkiVerStatusbyUs=0;
    }
    if (Boolean(req.body.chk_i_Ver_Status_notverify)==true){
        chkiVerStatus_notverify=0;
    }else{
        chkiVerStatus_notverify=1;
    }

    // Head size
    // console.log("head size "+ IsNumberEmpty( req.body.txt_hsr_from));
     
    txthsrfrom=IsEmpty( req.body.txt_hsr_from);
    txthsrto=IsEmpty( req.body.txt_hsr_to)?req.body.txt_hsr_to:100000;
    // price
        txtpricefrom=IsEmpty(req.body.txt_price_from);
        txtpriceto=IsEmpty(req.body.txt_price_to)? req.body.txt_price_to:100000;
    // Length
        txtlengthfrom=IsEmpty(req.body.txt_length_from);
        txtlengthto=IsEmpty(req.body.txt_length_to)?req.body.txt_length_to:100000;
    // racket Condition
        txtracketcondfrom=IsEmpty(req.body.txt_racketcond_from);
        txtracketcondto=IsEmpty(req.body.txt_racketcond_to)?req.body.txt_racketcond_to:100000;

    //GripSize
    txtracketGripfrom=IsEmpty(req.body.txt_racketGrip_from);
    txtracketGripto=IsEmpty(req.body.txt_racketGrip_to)?req.body.txt_racketGrip_to:100000;


    //Verify by us
    // chki_VerStatusbyUs
        // console.log(txtlengthfrom + '-'+ txtlengthto);
        // console.log("mnf" + IsEmpty(searchcondition));
        // console.log(chkiVerStatusbyUs);
    if (IsEmpty(searchcondition)==0){
        // console.log('empty ' + txthsrfrom + '-'+ txthsrto + '/' + txtpricefrom +'-' + txtpriceto + '/' +txtlengthfrom + '-' + txtlengthto )
        var data = await racketmodel.find(
            {$and:[
            {'i_HeadSize':{$gte:txthsrfrom,$lte:txthsrto} },
            {'i_Price':{$gte:txtpricefrom,$lte:txtpriceto} }, 
            {'i_Length':{$gte:txtlengthfrom,$lte:txtlengthto} },
            {'i_condrating_Id':{$gte:txtracketcondfrom,$lte:txtracketcondto} },
            {'i_GripSize':{$gte:txtracketGripfrom,$lte:txtracketGripto} },
            {$or:[
                {'i_Ver_Status':chkiVerStatusbyUs},
                {'i_Ver_Status':chkiVerStatus_notverify}
            ]}
            ]});
            // ,
            // {'i_HeadSize':{$gte:txthsrfrom,$lte:txthsrto} },
            // {'i_Price':{$gte:txtpricefrom,$lte:txtpriceto} },
            // {'i_Length':{$gte:txtlengthfrom,$lte:txtlengthto} }
     
    }else{

        var data = await racketmodel.find(
            {$and:[
                {'i_Mnf_Id':{$in:[  mnf0,mnf1,mnf2,mnf3,mnf4,mnf5,mnf6,mnf7,mnf8,mnf9,mnf10]}},
                {'i_HeadSize':{$gte:txthsrfrom,$lte:txthsrto} },
                {'i_Price':{$gte:txtpricefrom,$lte:txtpriceto} },
                {'i_Length':{$gte:txtlengthfrom,$lte:txtlengthto} },
                {'i_condrating_Id':{$gte:txtracketcondfrom,$lte:txtracketcondto} },
                {'i_GripSize':{$gte:txtracketGripfrom,$lte:txtracketGripto} },
                {$or:[
                    {'i_Ver_Status':chkiVerStatusbyUs},
                    {'i_Ver_Status':chkiVerStatus_notverify}
                ]}
            ]});
            // ,
            
        
    }

    const mfresult = await Mfmodel.find({});
        icount =1;
        if (req.user==null||req.user==undefined){
            res.render("index", { images: data, mf: mfresult,verified:true });
        }else{
            // console.log('mainpage ' + req.user);
        res.render("index", { images: data, mf: mfresult,user:req.user,username:userGlobal,cartItemCount:cartItemCount,verified:req.user.isverified });
        // res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified, Error: 'Invalid token or token expired' });

        }
    
        // res.render('/search', data );
        // console.log(data);

      

};


function IsEmpty(value){
    if (value==NaN){
        return 0;
    }else if(value==""){
        return 0;
    }else if (value==undefined){
        return 0;
    }else if(value==null){
        return 0;
    }else{
        return value;
    }
}