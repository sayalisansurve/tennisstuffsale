const express = require('express');
const async = require('hbs/lib/async');
const bcrypt = require('bcrypt');
const User = require('../src/models/users')
const resetToken = require('../src/models/resetTokens')
// var localStore = require('local-storage');
const Mfmodel = require('../src/models/manufacture.model')
const racketmodel = require('../src/models/rackets.model');
// const usermodel = require('../src/models/users');

const viewvistorsmodel = require('../src/models/viewvistors');
const { redirect, json } = require('express/lib/response');
const mailer = require('../controllers/sendMails');
const crypto = require('crypto');
var fs = require('fs');
var nodemailer = require('nodemailer');
const router = require('../route/user');
const { Types } = require('mongoose');
const res = require('express/lib/response');


///whats message
// const fs = require('fs');

///end




// const wbm = require('wbm');
// let genot = "";
//whatapp message
// const { Client, LocalAuth } = require('whatsapp-web.js');
// const client=require('client');
// const qrcode = require('qrcode-terminal');
// const client = new Client();
// const client = new Client({
//     authStrategy: new LocalAuth()
// });
// client.on('qr', qr => {
//     qrcode.generate(qr, {small: true});
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });
// client.on('message', message => {
// 	console.log(message.body);
// });
// client.on('message', message => {
// 	if(message.body === '!ping') {
// 		message.reply('pong');
// 	}
// });
// client.initialize();

////end whatsapp message

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
};

exports.getSignupForm = (req, res, next) => {
    // console.log("sayali hello");

    // console.log("login" + usernameGlobal);    
    // res.render('filesignup',{path:'/singup'});

    res.render('filelogin', { path: '/login', user: req.user, verified: true, regiseter: false });
    // res.render('Hello Sayali');
};

exports.postSignup = (req, res, next) => {
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var username1 = req.body.username1;
    var userlogin1 = req.body.userlogin1;
    var isSelling=req.body.isSelling;
    var errmessage = "";
    // console.log('register inside');
    if (password == "" || password == null || typeof password == undefined) {
        res.render('filelogin', { ErrorMessage2: '"Enter Password!"', verified: true, regiseter: true, username1: username1, userlogin1: userlogin1, email: email, mobile: mobile })
    } else {
        if (password !== confirmpassword) {
            errmessage = "Password not matched.";
            res.render('filelogin', { ErrorMessage2: errmessage, regiseter: true, verified: true, username1: username1, userlogin1: userlogin1, email: email, mobile: mobile })
        } else {
            // console.log(req.body.password);
            bcrypt.hash(password, 10, function (err, hash) {
                // console.log(hash);
                if (err) {
                    errmessage = "Something wrong. Try again.";
                    res.render('filelogin', { ErrorMessage2: errmessage, regiseter: true, verified: true, username1: username1, userlogin1: userlogin1, email: email, mobile: mobile });

                } else {

                    let userData = User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
                    if (userData == null) {
                        errmessage = "Already email or mobile exist.";
                        res.render('filelogin', { ErrorMessage2: errmessage, regiseter: true, verified: true, username1: username1, userlogin1: userlogin1, email: email, mobile: mobile });

                    } else {



                        const newUser = new User({
                            user_Id: 1,
                            username: req.body.username1,
                            userlogin: req.body.userlogin1,
                            mobile: req.body.mobile,
                            email: req.body.email,
                            password: hash,
                            isverified: false,
                            isSelling:isSelling
                        });

                        newUser.save()
                            .then(doc => {
                                var token = crypto.randomBytes(32).toString('hex');

                                let setToken = resetToken({ token: token, email: req.body.email }).save();
                                var url = "http://localhost:3000/user/verifyEmail?token=" + token;
                                //    sendEmail('sandeepsurvekop@yahoo.co.in',"Email verification",`Click this link to verify :${url}`);
                                mailer.sendVerifyEmail("sandeepsurvekop@yahoo.co.in", token, url);

                                res.render('filelogin', { ErrorMessage: "Verification  link send to Email.Click  to verify. ", ErrorMessage2: "", verified: true, regiseter: false })
                                // res.redirect('/login',{ErrorMessage:errmessage});
                            })
                            .catch(err => {
                                res.render('filelogin', { ErrorMessage2: '"Something wrong. Try again."', verified: true, regiseter: true, username1: username1, userlogin1: userlogin1, email: email, mobile: mobile })
                                throw new Error(err + "-" + 'Save User failed');
                            });
                    }

                }
            });


            // res.render('filelogin',{ErrorMessage2:errmessage,regiseter:true,verified:true});

        }

    }




};
exports.sendotp = async function (req, res, next) {
    genot = generateOTP();
    // console.log('login '+ genot);
    sendEmail('sandeepsurvekop@yahoo.co.in', 'Generated OTP :' + genot);
    return res.redirect('/register');
    // res.send(" Check email for OTP.");
    // next;
    // res.render('filelogin',{path:'/login',user:req.user});
    // res.redirect('/login');
};
// let userData=await User.findOne({
//     // $and:[
//         // {
//             $or:[
//                 {'userlogin':req.body.userlogin},
//                 {'mobile':req.body.userlogin}]
//         // }
//         // ,
//         // {
//         //     'password':req.body.password
//         // }
//     // ]
// })

exports.getLogIn = async function (req, res, next) {
    var userFind = false;
    var { userlogin, password } = req.body;
    if (userlogin == "" || userlogin == null || typeof userlogin == undefined) {
        res.render("filelogin", { userlogin: req.body.userlogin, ErrorMessage: 'Enter UserLogin or Mobile!', verified: true, cartItemCount: 0, regiseter: false });

    } else {
        if (password == "" || password == null || typeof password == undefined) {
            res.render("filelogin", { userlogin: req.body.userlogin, ErrorMessage: 'Enter Password!', verified: true, cartItemCount: 0, regiseter: false });

        } else {
            User.findOne({
                $or: [
                    { 'userlogin': userlogin },
                    { 'mobile': userlogin }
                ]
            })
                .then(userInDB => {
                    if (userInDB == null) {
                        userFind = false;
                    } else {
                        // console.log(userInDB.password);
                        bcrypt.compare(password, userInDB.password)
                            .then(match => {

                                if (match) {

                                    var coutQty = 0;

                                    for (i = 0; i < userInDB.cart.items.length; i++) {

                                        coutQty = coutQty + userInDB.cart.items[i].qty;
                                    }
                                    cartItemCount = coutQty;
                                    if (req.body.rememberme) {
                                        userInDB.rememberme = true;
                                    } else {
                                        userInDB.rememberme = false;
                                    }
                                    userInDB.save();
                                    req.user = userInDB;
                                    if (req.body.rememberme) {
                                        // console.log('login'+ req.body.rememberme);
                                        localStorage.setItem('myK', JSON.stringify(userInDB._id));

                                    }
                                    userGlobal = userInDB.username;
                                    userGlobal_Id = userInDB._id;
                                    userFind = true;
                                    res.redirect('/');
                                    // console.log(match);
                                } else {
                                    res.render("filelogin", { userlogin: userlogin, ErrorMessage: 'Login or Password wrong!', verified: true, regiseter: false });
                                    console.log('Login or Password Wrong');
                                }

                            })
                            .catch(err => {
                                res.render("filelogin", { userlogin: userlogin, ErrorMessage: 'Login or Password wrong!', verified: true, cartItemCount: 0, regiseter: false });
                                userFind = false;
                                console.log(err);
                            });
                        // let match = checkPassword(req.body.password, userInDB.password);



                    }

                })
                .catch(err => {
                    userFind = false;
                    return res.render("filelogin", { username: userlogin, ErrorMessage: 'Login or Password wrong!', verified: true, cartItemCount: 0 });
                    console.log(err + 'Login or Password Wrong');
                });
        }
    }





    // const result = await racketmodel.find({});
    // const mfresult = await Mfmodel.find({});

    // if (userFind == true) {
    //     res.redirect('/');
    // } else {
    //     return res.render("filelogin", { ErrorMessage: 'Login or Password wrong!' });

    // }
}
async function checkPassword(enteredPassword, databasePassword) {
    //... fetch user from a db etc.

    await bcrypt.compare(enteredPassword, databasePassword)
        .then(match => {
            return match;
        })
        .catch(err => {
            console.log('in checkpassword');
            console.log(err);
        })



};

exports.getCart = async (req, res, next) => {


    // console.log('getCart'+ req.user);
    // let result=await cartList();
    // console.log(result.cart);
    req.user
        .populate('cart.items.racketId')
        .then(user => {
            // console.log("req.user"+req.user);
            // console.log("cart" + user.cart.items[0].racketId);
            // if (cart.length>0)
            // console.log (user.cart.items[0].racketId)
            // console.log(cartItemCount);
                res.render('fileshoppingcart', { cart: user.cart, title: 'Shopping Cart Details', path: '/cart', user: user, username: userGlobal, cartItemCount: cartItemCount, verified: true });
            // endif
        })
        .catch(err => console.log(err));
    // res.render('fileshoppingcart');
};

// console.log('controller');
exports.getMagetMainPage = async function (req, res, next) {

    // console.log('Main Page');
    

//hit count
    let visitorlast=await viewvistorsmodel.find().sort({i_vistor_count:-1}).limit(1)
    // console.log(visitorlast.i_vistor_count);
        if (visitorlast==null||typeof visitorlast==undefined||visitorlast==""){
            let newvisitorlast=viewvistorsmodel({
                i_vistor_count:   1
            });
            newvisitorlast.save();
            // console.log(newvisitorlast);
            
        } 
        else{
            // console.log(visitorlast._id);
            let updateData=await viewvistorsmodel.findByIdAndUpdate(visitorlast[0]._id);
            // console.log(updateData);

            updateData.i_vistor_count=updateData.i_vistor_count+1;
            updateData.save();
            // console.log(updateData.i_vistor_count);
        }
        
    
    //  .then(visitorlast=>{
    //     if (visitorlast==null||typeof(visitorlast==undefined)){
    //         visitorlast.i_vistor_count=    1;
    //     } 
    //     else{
    //         visitorlast.i_vistor_count=visitorlast.i_vistor_count+1;
    //     }
        
    //     console.log('visitor count : '+ visitorlast.i_vistor_count);
    //  })
    // .catch(err=>{
    //     console.log(err);
    // })
     
    
    


    // user last login in localstorage
    var coutQty = 0;
    if (typeof localStorage == "undefined" || localStorage == null) {
        req.user = null;
        userGlobal = "";
        userGlobal_Id = "";
    } else {
        if (localStorage.getItem('myK') !== null) {
            let user = JSON.parse(localStorage.getItem('myK'));
            let userData = await User.findById({ _id: user });
            req.user = userData;
            userGlobal = req.user.username;
            userGlobal_Id = req.user._id;
            for (i = 0; i < req.user.cart.items.length; i++) {

                coutQty = coutQty + req.user.cart.items[i].qty;
            }
        }
    }
    cartItemCount = coutQty;
    var result = await racketmodelList();
    // result.forEach(function(mydoc){
    //     console.log(mydoc);
    // }

    // )



    // const result = await racketmodel.find({});
    // console.log(result);
    const mfresult = await Mfmodel.find({});
    icount = 1;
    // console.log(cartItemCount);
    if (req.user == null || typeof req.user == undefined) {
        // console.log('inside if main page' + req.user);
    
        res.render("index", { images: result, mf: mfresult, username: "", cartItemCount: 0, verified: true });
    } else {
        res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified });
    }


};

exports.logout = async (req, res) => {
    let userData = await User.findById(req.user._id);
    userData.rememberme = false;
    userData.save();
    userGlobal = "";
    userGlobal_Id = [];
    cartItemCount = 0;
    req.user = "";
    localStorage.clear();
    localStorage.removeItem('myK');
    const result = await racketmodel.find({});
    const mfresult = await Mfmodel.find({});
    icount = 1;
    // response.end("something");
    if (req.user == null || req.user == undefined) {

        res.render("index", { images: result, mf: mfresult, verified: true });
    } else {
        res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: true });
    }

};
exports.newracketget=async (req, res) => {
    res.render("newfileupload");

};


exports.newracket=async(req,res)=>{
    // console.log(req.files);
    if (req.files){
        // console.log(req.files.file.length);
        var file;
        var filename;
        cFolderName="/images/uploads/" + 11+"/";
        dir = "./public/images/uploads/" + 11+"/";
    
            if (!fs.existsSync(dir)) {
                // create it
                fs.mkdirSync(dir);
            }
        
            for(i=0;i<req.files.file.length;i++){
                file =req.files.file[i];
                // console.log(file);
                filename=file.name;
                // console.log( "Hello "+ i + "-" + filename);+
                // console.log('./public' + cFolderName);
                file.mv('./public' + cFolderName+filename,function(err){
                    if(err){
                        console.log(err);
                    }else{
                        
                    }
                });
            }
            
        

    }
};

exports.deletephoto = async (req, res, next) => {
    id = req.params.id;
    // console.log(id);
    try {
        const edit = await racketmodel.findById({ _id: id }, { c_FolderName: 1 })


        let dir = "./public" + edit.c_FolderName;
        if (fs.existsSync(dir)) {
            // create it
            // fs.delet(dir);
            // fs.rmdir(edit.c_FolderName,{recursive: true });
            // console.log(edit.c_FolderName);

            fs.unlinkSync(dir, (err) => {
                if (err) {
                    throw err;
                }

                console.log(`${dir} is deleted!`);
            });
        }
        const result = await racketmodel.deleteOne({ _id: id })
        iMaxRktId = await getmaxId() + 1;
        console.log("Delete Max id" + iMaxRktId);
        // console.log(result);
        ///alert("Deleted Successfully.")
    } catch (err) {
        console.log(err);
    }

};

//forgot password
exports.forgotpassword = async (req, res, next) => {
    res.render('fileforgotpassword')
};

exports.forgotpasswordpost = async (req, res, next) => {
    const { email } = req.body;
    if (email == null || email == "" || typeof email == undefined) {
        res.render('fileforgotpassword', { ErrorMessage: "Enter email!" })
    } else {
        var userData = await User.findOne({ email: email });
        if (userData) {
            // send verification email
            console.log(email);
            var token = crypto.randomBytes(32).toString('hex');
            await resetToken({ token: token, email: email }).save();
            var url = "http://localhost:3000/user/reset-password?token=" + token;
            mailer.sendVerifyEmail("sandeepsurvekop@yahoo.co.in", token, url);
            res.render('fileforgotpassword', { ErrorMessage: "Reset link send to Your email" })

        } else {
            res.render('fileforgotpassword', { ErrorMessage: "No User found!" })
        }
    }

};

//send verification email
exports.sendverificationemail = async (req, res, next) => {
    if (req.user == null || req.user == undefined) {
    } else {
        if (req.user.isverified) {
            res.redirect('/');
        } else {
            // send verification email
            var token = crypto.randomBytes(32).toString('hex');
            await resetToken({ token: token, email: req.user.email }).save();
            var url = "http://localhost:3000/user/verifyEmail?token=" + token;
            mailer.sendVerifyEmail(req.user.email, token, url);
            const result = await racketmodel.find({});
            const mfresult = await Mfmodel.find({});
            // console.log( 'Get Main Page'+req.user);
            icount = 1;

            // console.log('inside if main page');
            // console.log('mainpage ' + req.user);
            res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified, emailSend: true });

            // console.log(token);
            // res.redirect('/'); 

        }
    }

}
//verify token
exports.verifyEmail = async (req, res) => {
    const token = req.query.token;
    console.log("verify email" + token);
    const result = await racketmodel.find({});
    const mfresult = await Mfmodel.find({});

    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {
            var userData = await User.findOne({ email: check.email });
            // req.user.isverified=true;
            userData.isverified = true;
            await userData.save();
            // console.log('verify email verified' + req.user.isverified);
            await resetToken.findOneAndDelete({ token: token });
            // res.redirect('/');
            if (req.user == null || req.user == undefined) {
                // console.log('inside if main page' + req.user);
                // res.render("index", { images: result, mf: mfresult, verified: true });
                res.render('filelogin', { ErrorMessage: "", ErrorMessage2: "", verified: true, regiseter: false })
            } else {
                res.render('filelogin', { ErrorMessage: "", ErrorMessage2: "", verified: true, regiseter: false })
                // res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: 0, verified: req.user.isverified });
            }
            // console.log('found token');
        } else {
            // console.log( 'Get Main Page'+req.user);
            icount = 1;

            // console.log('inside if main page');
            // console.log('mainpage ' + req.user);
            console.log('Invalid Token');
            res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified, Error: 'Invalid token or token expired' });

        }
    } else {
        res.redirect('/');
    }
};
//reset forgot password
exports.resetpassword = async (req, res) => {
    const token = req.query.token;
    console.log("reset email" + token);
    const result = await racketmodel.find({});
    const mfresult = await Mfmodel.find({});

    if (token) {
        var check = await resetToken.findOne({ token: token });
        if (check) {

            res.render('fileforgotpassword', { reset: true, email: check.email })
        } else {
            icount = 1;
            console.log('Invalid Token');
            //res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified, Error: 'Invalid token or token expired' });
            res.render('fileforgotpassword', { ErrorMessage: "Token tempered or Expired.", reset: false })

        }
    } else {
        res.redirect('/');
    }
};
exports.resetpasswordpost = async (req, res) => {
    const { password, confirmpassword, email } = req.body;

    if (!password || !confirmpassword || password != confirmpassword) {
        res.render('fileforgotpassword', { ErrorMessage: "Enter Password and Confirm password properly.", reset: true, email: email });
    } else {
        var salt = await bcrypt.genSalt(12);
        var hash = await bcrypt.hash(password, salt);
        await User.findOneAndUpdate({ email: email }, { $set: { password: hash } });
        res.redirect('/login');

    }

};



// sendig Email
function sendEmail(toEmail, subject, text, templateFile) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sayalisansurve@gmail.com',
            pass: 'xwphlrqbsjdvbcun'
        }

    })
    var mailOptions = {
        from: 'sayaliss1@yahoo.co.in',
        to: toEmail,
        subject: subject,


    }
    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            e
            console.log(error);
        }
        else {
            console.log('Email sent:' + info.response);
        }
    })
}

exports.contactus = async (req, res) => {
    if (req.user == null || typeof req.user == undefined) {
        // console.log('inside if main page' + req.user);
        res.render("filecontactus", { username: "", cartItemCount: 0, verified: true });
    } else {
        // res.render("index", { images: result, mf: mfresult, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified });
        res.render("filecontactus", { user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified });
    }

};

// random numbe generation
function generateOTP() {

    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

let cartList=async function(){
    var cart =await User.aggregate([

        {
            $match: {}
        },
        {
            $lookup:
            {
                from :'rackets',
                localField :'cart.racketId',
                foreignField:'_id',
                as:'cartdetails'
            }
            
        }
        // {
        //     $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$cartdetails", 0] }, "$$ROOT"] } }
        // },
        // {$project:{
        //     c_Rkt_Name:1,
        //     i_Price: 1 
             
        // }}
        // { $project: { cartdetails: 1 } }

        
    ]);
    return cart;

};

let racketmodelList = async function () {
    var edit = await racketmodel.aggregate([
        {
            $match: {}
        },
        {
            $lookup:
            {
                from: 'manufacturers',
                localField: 'i_Mnf_Id',
                foreignField: 'i_Mnf_Id',
                as: 'manuf_details'
            }
        },
        {
            $lookup:
            {
                from: 'series',
                localField: 'i_seriesId',
                foreignField: 'i_seriesId',
                as: 'series_details'
            }
        },
        {
            $lookup:
            {
                from: 'racketmodels',
                localField: 'i_Raket_Model_Id',
                foreignField: 'i_Raket_Model_Id',
                as: 'racketmodel_details'
            }
        },
        {
            $lookup:
            {
                from: 'conditionratings',
                localField: 'i_condrating_Id',
                foreignField: 'i_condrating_Id',
                as: 'conditionrating_details'
            }
        },

        {
            $lookup:
            {
                from: 'deliverystatuses',
                localField: 'i_Delivery_Status',
                foreignField: 'i_Delivery_Status',
                as: 'deliverystatus_details'
            }
        },

        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$manuf_details", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$series_details", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$racketmodel_details", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$conditionrating_details", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$deliverystatus_details", 0] }, "$$ROOT"] } }
        },


        { $project: { manuf_details: 0 } },
        { $project: { series_details: 0 } },
        { $project: { racketmodel_details: 0 } },
        { $project: { conditionrating_details: 0 } },
        { $project: { deliverystatus_details: 0 } }
    ]);
    return edit;
};
