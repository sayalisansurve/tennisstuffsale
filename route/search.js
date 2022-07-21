const express=require('express');
const path=require('path');
const router=express.Router();
const searchController=require('../controllers/search');

router.use(express.urlencoded({ extended: false })); //to use html page element access

// router.get('/login',userController.getSignupForm);
router.post('/search',searchController.getsearch);
router.post('/removesearch',searchController.removesearch);

module.exports = router;
