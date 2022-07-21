const express=require('express');
const path=require('path');
const router=express.Router();
// const router = require('express').Router();

const userController=require('../controllers/user');
// const userController=require('../controllers/user');
// console.log('router');

router.get('/login',userController.getSignupForm);
router.post('/register',userController.postSignup);
router.post('/login',userController.getLogIn);
// router.post('/snd',userController.sendotp);
router.get('/user/send-verification-email', userController.sendverificationemail);
router.get('/user/verifyemail',userController.verifyEmail);
router.get('/',userController.getMagetMainPage);
router.get('/user/forgot-password',userController.forgotpassword);
router.post('/user/forgot-password',userController.forgotpasswordpost);
router.get('/user/reset-password',userController.resetpassword);
router.post('/user/reset-password',userController.resetpasswordpost);


router.get('/newracket',userController.newracketget);
router.post('/newracket',userController.newracket);

router.get('/logout',userController.logout)
// router.post('/add-to-cart',shopController.addToCart);


router.get('/cart',userController.getCart)

// router.get('/sendmessage',userController.sendmessage);

router.post('/deletephoto/:id',userController.deletephoto);


router.get ('/contactus',userController.contactus);
// router.post('/search',userController.getsearch);
module.exports = router;
