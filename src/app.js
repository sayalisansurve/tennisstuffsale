const express = require('express');
const path = require("path");
var multer = require('multer');
const fs = require('fs');

require('./db/conn_mongodb');

const productmodel = require('./models/products.model')
const customermodel = require('./models/customer.model')
const Mfmodel = require('./models/manufacture.model')
const racketmodel = require('./models/rackets.model')
const seriesmodel = require('./models/series.model')
const rktModelmodel = require('./models/racketmodels.model')
const deliveryStatusmodel = require('./models/deliverystatus.model')
const conRatingmodel = require('./models/conditionrating.model');
const shopController = require('../controllers/shopcart.controller');
const User = require('./models/users');
var ObjectId = require('mongodb').ObjectID;
const uploadfile = require('express-fileupload');


global.userGlobal = [];
global.userGlobal_Id = [];
global.cartItemCount = 0;

const userRouters = require('../route/user')
const searchRouters = require('../route/search')

const hbs = require('hbs');
const async = require('hbs/lib/async');
const res = require('express/lib/response');
const { Mongoose } = require('mongoose');
const { markAsUntransferable } = require('worker_threads');
const { Console } = require('console');
const { render } = require('express/lib/response');
var nodemailer = require('nodemailer');
const app = express();
// hosted webserve port get
const port = process.env.port || 3000;
//setting path

const staticpath = path.join(__dirname, "../public");
const templatespath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
app.use(uploadfile());
app.use(async (req, res, next) => {
    var coutQty = 0;

    if (typeof localStorage == "undefined" || localStorage == null) {

        req.user = null;

        userGlobal_Id = "";
        userGlobal = "";
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
            next();
        } else {
            // console.log(localStorage);
            req.user = null;
            userGlobal_Id = "";
            userGlobal = "";
            next();
        }
    }
    cartItemCount = coutQty;

    // console.log('app.use' +req.user);
    // console.log("app.use");
    // if (userGlobal_Id!==""||userGlobal_Id!==null){
    //     User.findById(userGlobal_Id)
    //     .then(userInDB=>{
    //         req.user=userInDB;
    //         next();
    //     })
    //     .catch(err=> console.log(err))

    //     } else{
    //     }       
   
    // racketmodel.find({}).sort({ "i_Rkt_Id": -1 }).limit(1)
    //     .then(maxrackeId => {
    //         // console.log(maxrackeId);
    //         if (typeof maxrackeId==undefined||maxrackeId==null||maxrackeId==[]){
    //             req.iMaxRktId = 0;
    //         }else{
    //             if (typeof maxrackeId[0].i_Rkt_Id==undefined){
    //                 req.iMaxRktId = 0;
    //             }else{
    //                 req.iMaxRktId = maxrackeId[0].i_Rkt_Id;    
    //             }
    //         }
            
    //     })
    //     .catch(err => console.log(err));

});


app.use(express.urlencoded({ extended: false })); //to use html page element access
app.use(express.static(staticpath));
app.use(userRouters);
app.use(searchRouters);

app.set("view engine", "hbs");
app.set("views", templatespath);
hbs.registerPartials(partialspath);

///register handlebar helper
hbs.registerHelper('ifCondRating', function (i_condratingID, options) {
    var cImageLink;
    if (i_condratingID == 1) {
        cImageLink = "/images/OneRatingRed.png"
    }
    else if (i_condratingID == 2) {
        cImageLink = "/images/TwoRatingRed.png"
    }
    else if (i_condratingID == 3) {
        cImageLink = "/images/ThreeRatingRed.png"
    }
    else if (i_condratingID == 4) {
        cImageLink = "/images/FourRatingRed.png"
    }
    else if (i_condratingID == 5) {
        cImageLink = "/images/FiveRatingRed.png"
    }
    else if (i_condratingID == 6) {
        cImageLink = "/images/SixRatingRed.png"
    }
    else if (i_condratingID == 7) {
        cImageLink = "/images/SevenRatingRed.png"
    }
    else if (i_condratingID == 8) {
        cImageLink = "/images/EightRatingRed.png"
    }
    else if (i_condratingID == 9) {
        cImageLink = "/images/NineRatingRed.png"
    }
    else if (i_condratingID == 10) {
        cImageLink = "/images/TenRatingRed.png"
    }
    return cImageLink
});

hbs.registerHelper('ifcond', function (a, options) {

    if (a < 5) {
        // console.log('row 1 -' + a)
        return options.fn(this);

    }
    //else if (a>=5 && a<10){
    //     console.log('row 2 -' + a)
    //     return options.fn(this);
    // } 
    // else if (a>=10 && a<20){
    //     console.log('row 3 -' + a)
    //     return options.fn(this);
    // } 

    else {
        return options.inverse(this);
    }

});

hbs.registerHelper('ifcondgt5le10', function (a, options) {
    if (a > 4  ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('ifcondgt10le19', function (a, options) {
    if (a > 9) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('ifMod', function (a, options) {
    if (a % 2 === 0) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});
hbs.registerHelper('ifMod1', function (a, options) {
    if (a % 2 === 1) {
        return options.fn(this);
    }

});

hbs.registerHelper('ifequal', function (a, opts) {
    if (a == 1) {
        return true;
    } else {
        return false;
    }
});

hbs.registerHelper('ifbool', function (a, opts) {
    if (a == true) {
        return true;
    } else {
        return false;
    }
});

hbs.registerHelper('iif', function (a, operator, b, opts) {
    var bool = false;

    switch (operator) {
        case '==':
            bool = a == b;
            break;
        case '>':
            bool = a > b;
               break;
        case '<':
            bool = a < b;
            break;

        default:
            throw "Unknown operator " + operator;
    }

    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
hbs.registerHelper('operations', function (a, operator, b, opts) {
    var result = 0;
    // console.log(a);
    switch (operator) {
        case '*':
            result = a * b;
            break;
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '':
            result = a / b;
            break;

        default:
            throw "Unknown operator " + operator;
    }
    if (result) {
        return result
    } else {
        return 0;
    }
});

hbs.registerHelper("select", function (value1, value2, options) {
    if (value1 == value2) {
        return "Selected"

    } else {
        return ""
    }
});

hbs.registerHelper('iifequalBool', function (value1, value2, options) {
    if (value1 == value2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper('iifGreaterthanZero', function (value1, options) {
    if (value1 > 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//   --------------------------End Helper------------------------------------------

var iMaxRktId = 0;
async function getmaxId() {
    var getdata = await racketmodel.find({}).sort({ "i_Rkt_Id": -1 }).limit(1);
    if (getdata.length > 0) {
        iMaxRktId = getdata.i_Rkt_Id;
        return getdata[0].i_Rkt_Id;
    } else {
        return 0;
    };
}
var dir;
var cFolderName;
iMaxRktId = getmaxId() + 1;
var iCount = 1;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        dir = "./public/images/uploads/" + iMaxRktId;
        cFolderName = "/images/uploads/" + iMaxRktId;
        if (!fs.existsSync(dir)) {
            // create it
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        // cb(null,  file.originalname +path.extname(file.originalname))
        cb(null, file.originalname)
        // var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        // cb(null, file.fieldname + ext)
        // cb(null,  "product-" + iCount++ +path.extname(file.originalname) )
        //+ "_" +Date.now()+path.extname(file.originalname))
        // cb(null,  file.fieldname +path.extname(file.originalname))
    }


    // console.log(req.body.c_Rkt_Name);
});
// iCount=iCount+1;
// var upload=multer({storage:storage}).single('pimage1');
// var upload = multer({ storage: storage }).array("pimage1", 50);
var upload = multer({ storage: storage }).array("pimage1", 15);
//---------------------------------------------------------------------------------------------------------------------------

//routing
// 
// const products=productmodel.find({});
// 
let icount = 0;
// app.get('/', async (req, res) => {
//     const result = await racketmodel.find({});
//     const mfresult = await Mfmodel.find({});
//     icount =1;
//         if (req.user==null||req.user==undefined){
//             res.render("index", { images: result, mf: mfresult});
//         }else{
//             console.log('mainpage ' + req.user);
//         res.render("index", { images: result, mf: mfresult,user:req.user });
//         }


// });
// ------------Customer Contact---------------------- 
app.get('/account', (req, resp) => {
    //resp.send("Hi I m awesome");
    resp.render("cust_account");
});
app.post("/account", async (req, resp) => {
    try {
        //    resp.send(req.body);
        // console.log(req.body)
        const userData = new customermodel(req.body);
        result = await userData.save()
        // console.log(result);
        res.send(" File Saved Successfully.");
    } catch (error) {
        resp.status(500).send(error);
    }

});

// ------------------------------------------

app.get('/upload', async (req, res) => {

    // if (req.user == null || req.user == undefined) {

    // } else {
    //     var edit2 = await racketmodel.find({ userId: req.user._id });
    // }
    iMaxRktId = await getmaxId();
    iMaxRktId = iMaxRktId + 1;
    var mnf = await manufacturerList();
    var series = await seriesList();
    var rktModel = await rktmodelList();
    console.log(req.user._id);
    
    var deliveryStatus = await deliveryStatusList();
    var condRating = await condRatinglList();
    // console.log(edit.find({ userId: req.user._id }));
    console.log(edit);

    if (req.user == null || req.user == undefined) {
        res.render('fileupload', { title: 'Edit/Delete Products Record', Mnflist: mnf, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating });
    }
    else {
        var edit = await racketmodelList(req.user._id);
        res.render('fileupload', { title: 'Edit/Delete Products Record', Mnflist: mnf, records: edit, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified });
    }
})

app.post('/upload', async function (req, res, next) {
    iMaxRktId = await getmaxId() + 1;
    cFolderName = "/images/uploads/" + iMaxRktId +'-' + req.user._id +'/';
    dir = "./public/images/uploads/" + iMaxRktId +'-' + req.user._id;

    // console.log(req.files);
    // console.log(req.files.pimage1);

    if (req.files) {
        var dataRecord = {
            i_Rkt_Id: parseInt(iMaxRktId),
            c_Rkt_Name: req.body.c_Rkt_Name,
            c_Rkt_Desc: req.body.c_Rkt_Desc,
            i_Price: req.body.i_Price,
            i_Mnf_Id: parseInt(req.body.mnf),
            i_seriesId: parseInt(req.body.series),
            i_condrating_Id: parseInt(req.body.i_Cond_Rating),

            i_Delivery_Status: parseInt(req.body.i_Delivery_Status),
            i_HeadSize: req.body.i_HeadSize,
            i_Weight_Un_St: req.body.i_Weight_Un_St,
            i_Length: req.body.i_Length,
            i_GripSize: parseInt(req.body.i_GripSize),
            i_Ver_Status: parseInt(req.body.i_Ver_Status),
            i_Sale_Status: parseInt(req.body.i_Sale_Status),
            i_Raket_Model_Id: parseInt(req.body.i_Raket_Model_Id),
            c_FolderName: cFolderName,
            c_mainImageName: req.files.pimage1[0].name,
            userId: req.user._id
        }
    } else {
        var dataRecord = {
            i_Rkt_Id: parseInt(iMaxRktId),
            c_Rkt_Name: req.body.c_Rkt_Name,
            c_Rkt_Desc: req.body.c_Rkt_Desc,
            i_Price: req.body.i_Price,
            i_Mnf_Id: parseInt(req.body.mnf),
            i_seriesId: parseInt(req.body.series),
            i_HeadSize: req.body.i_HeadSize,
            i_Weight_Un_St: req.body.i_Weight_Un_St,
            i_Length: req.body.i_Length,
            i_GripSize: parseInt(req.body.i_GripSize),
            i_Ver_Status: parseInt(req.body.i_Ver_Status),
            i_Sale_Status: parseInt(req.body.i_Sale_Status),
            i_Raket_Model_Id: parseInt(req.body.i_Raket_Model_Id),
            i_condrating_Id: req.body.i_Cond_Rating,
            i_Delivery_Status: parseInt(req.body.i_Delivery_Status),
            c_FolderName: cFolderName,
            c_mainImageName: req.files.pimage1[0].name,
            userId: req.user._id
        }
    }
    try {
        const racketData = await racketmodel(dataRecord);
        const result = await racketData.save();
        //Image upload to folder
        if (req.files) {
            // console.log(req.files.file.length);
            var file;
            var filename;
            // cFolderName="/images/uploads/" + 11+"/";
            // dir = "./public/images/uploads/" + 11+"/";
            //if folder not exist created
            if (!fs.existsSync(dir)) {
                // create it
                fs.mkdirSync(dir);
            }

            for (i = 0; i < req.files.pimage1.length; i++) {
                file = req.files.pimage1[i];
                // console.log(file);
                filename = file.name;
                // console.log( "Hello "+ i + "-" + filename);+
                // console.log('./public' + cFolderName);
                file.mv('./public' + cFolderName + filename, function (err) {
                    if (err) {
                        console.log(err);
                    } else {

                    }
                });
            }

            



        }

        //end image upload
        var mnf = await manufacturerList();
        var series = await seriesList();
        var rktModel = await rktmodelList();
        // var edit = await racketmodelList()
        iMaxRktId = await getmaxId() + 1;
        //res.render('fileupload', { title: 'Edit Products Record', Mnflist: mnf, records: edit, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified,savemessage:"Racket Saved" });
        var edit = await racketmodelList(req.user._id);
        console.log('Saved Successfully.')
        
        res.render('fileupload', { title: 'Edit/Delete Products Record', Mnflist: mnf, records: edit, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified,savemessage:"Racket Saved" });

    } catch (err) {
        res.status(500).send(err);
    }
});

//  ------Edit Rackets------------------------------------

app.get('/edit/:id', async function (req, res, next) {
    var id = req.params.id;
    var mnf = await manufacturerList();
    var series = await seriesList();
    var rktModel = await rktmodelList();
    var deliveryStatus = await deliveryStatusList();
    var condRating = await condRatinglList();
    var edit = await racketmodel.findById(id);
    var imageList = [];
    var imagename=[];
    iMaxRktId = edit.i_Rkt_Id;
    fs.readdir("./public" + edit.c_FolderName + "/", (err, files) => {
        if (!files) {
            console.log("No files found in folder" + edit.c_FolderName);
        }
        else {
            for (let index = 0; index < files.length; ++index) {
                imageList.push({ src: edit.c_FolderName + "/" + files[index], name: files[index] });
                // imagename.push( files[index]);
                imagename[index]=files[index];
            };
            // console.log(imageList);
        }
        if (req.user == null || req.user == undefined) {

            res.render('fileedit', { title: 'Edit Rackets Record', records: edit, Mnflist: mnf, Serieslist: series, Modellist: rktModel, imageList: imageList, deliveryStatuslist: deliveryStatus, condRating: condRating,imagename:imagename  });
        }
        else {
            res.render('fileedit', { title: 'Edit Rackets Record', records: edit, Mnflist: mnf, Serieslist: series, Modellist: rktModel, imageList: imageList, deliveryStatuslist: deliveryStatus, condRating: condRating, user: req.user, username: userGlobal, cartItemCount: cartItemCount, verified: req.user.isverified,imagename:imagename });
        }
    })


});
// ------End Get Edit-------------------------------  
// -------Update------------------------------------
app.post('/update/:id',  async function (req, res, next) {
    var mainimge;
    // cFolderName = "/images/uploads/" + iMaxRktId + "/";
    // dir = "./public/images/uploads/" + iMaxRktId;
    cFolderName = "/images/uploads/" + iMaxRktId +'-' + req.user._id +'/';
    dir = "./public/images/uploads/" + iMaxRktId +'-' + req.user._id;
    // if (!req.files.length==0) {
        // console.log(req.files);
    if (req.files){
        mainimge = req.files.pimage1[0].name;
    }else{
        mainimge =req.body.c_mainImageName;
    }
    
    
    // console.log(mainimge);
    // }
    // else {
    //     mainimge = req.body.c_mainImageName;
    // }
    var dataRecord = {
        c_Rkt_Name: req.body.c_Rkt_Name,
        c_Rkt_Desc: req.body.c_Rkt_Desc,
        i_Price: req.body.i_Price,
        i_Mnf_Id: parseInt(req.body.mnf),
        i_seriesId: parseInt(req.body.series),
        i_Cond_Rating: req.body.i_Cond_Rating,
        i_Delivery_Status: parseInt(req.body.i_Delivery_Status),
        i_HeadSize: req.body.i_HeadSize,
        i_Weight_Un_St: req.body.i_Weight_Un_St,
        i_Length: req.body.i_Length,
        i_GripSize: parseInt(req.body.i_GripSize),
        i_Ver_Status: parseInt(req.body.i_Ver_Status),
        i_Sale_Status: parseInt(req.body.i_Sale_Status),
        i_Raket_Model_Id: parseInt(req.body.i_Raket_Model_Id),
        c_FolderName: cFolderName,
        c_mainImageName: mainimge
    }
    // console.log(req.params.id);

    id = req.params.id
    try {
        var update = racketmodel.findByIdAndUpdate({ _id: id }, dataRecord);
        update.exec(function (err, data) {
            if (err) throw "error Sayali " + err;
            //Image upload to folder
            if (req.files) {
                var file;
                var filename;
                if (!fs.existsSync(dir)) {
                    // create it
                    fs.mkdirSync(dir);
                }
                else{
                    //delete files
                    fs.readdir(dir, (err, files) => {
                        if (err) throw err;
                      
                        for (const file of files) {
                          fs.unlink(path.join(dir, file), err => {
                            if (err) throw err;
                          });
                        }
                      });
                }

                for (i = 0; i < req.files.pimage1.length; i++) {
                    file = req.files.pimage1[i];
                    filename = file.name;
                    console.log('./public' + cFolderName + filename);
                    file.mv('./public' + cFolderName + filename, function (err) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    });
                }

            }

            //end image upload

            res.redirect("/upload");
        });
    } catch (err) {
        res.status(500).send(err);
    }

});
// -------End Update------------------------------------
// ------------------------Delete Rackets
app.get('/delete/:id', async function (req, res, next) {
    id = req.params.id;
    try {
        const edit = await racketmodel.findById({ _id: id }, { c_FolderName: 1 })
        let dir = "./public" + edit.c_FolderName;
        if (fs.existsSync(dir)) {
            fs.rm(dir, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }

                console.log(`${dir} is deleted!`);
            });
        }
        const result = await racketmodel.deleteOne({ _id: id })
        console.log("Delete Max id" + id);
        iMaxRktId = await getmaxId() + 1;
        
    } catch (err) {
        console.log(err);
    }
    // -\**********************************render coding
    var mnf = await manufacturerList();
    var series = await seriesList();
    var rktModel = await rktmodelList();
    var edit = await racketmodelList()

    if (req.user == null || req.user == undefined) {
        res.render('fileupload', { title: 'Edit Products Record', Mnflist: mnf, records: edit, length: edit.length, Serieslist: series, Modellist: rktModel, username: userGlobal, cartItemCount: cartItemCount });
    }
    else {

        res.render('fileupload', { title: 'Edit Products Record', Mnflist: mnf, records: edit, length: edit.length, Serieslist: series, Modellist: rktModel, user: req.user, username: userGlobal, cartItemCount: cartItemCount });
    }


});
// -----------------------------------------------------------------

// --------------------Product-details--------------------------------
app.get('/productdetails/:id', async function (req, res, next) {
    var id = req.params.id;
    var imageList = [];
    var edit = await racketmodel.findById(id);
    var mnf = await Mfmodel.findOne({ i_Mnf_Id: edit.i_Mnf_Id });
    var series = await seriesmodel.findOne({ i_seriesId: edit.i_seriesId });
    var rktModel = await rktModelmodel.findOne({ i_Raket_Model_Id: edit.i_Raket_Model_Id });
    var condRating = await conRatingmodel.findOne({ i_condrating_Id: edit.i_condrating_Id });
    var deliveryStatus = await deliveryStatusmodel.findOne({ i_Delivery_Status: edit.i_Delivery_Status });
    var usercartitemqty = 0;
    
    // for getting userwise racketwise cart qty
    // console.log(condRating);
    // console.log(req.user);
    if (req.user != null || req.user != undefined) {
        await racketmodel.findById(id)
            .then(racket => {
                usercartitemqty = req.user.cartitemqty(racket)
            })
            .catch(err => {
                throw new Error(err + "-" + 'Save User failed');
            });
    }
    fs.readdir("./public" + edit.c_FolderName + "/", (err, files) => {
        if (!files) {
            console.log("No files found in folder" + edit.c_FolderName);
        }
        else {
            for (let index = 0; index < files.length; ++index) {
                imageList.push({ src: edit.c_FolderName + "/" + files[index], name: files[index] });
            };

        }
        // console.log(edit.c_Rkt_Desc);
        // console.log(req.user);
        if (req.user == null || req.user == undefined) {
            res.render('fileproductdetails', { Mnflist: mnf, records: edit, imageList: imageList, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating, username: userGlobal, cartItemCount: 0, cartItemwiseCount: 0, verified: true });
        }
        else {

            if (req.user.cart.items.length == 0) {
                res.render('fileproductdetails', { Mnflist: mnf, records: edit, imageList: imageList, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating, user: req.user, username: userGlobal, cartItemCount: cartItemCount, cartItemwiseCount: 0, verified: req.user.isverified });
            } else {
                res.render('fileproductdetails', { Mnflist: mnf, records: edit, imageList: imageList, length: edit.length, Serieslist: series, Modellist: rktModel, deliveryStatuslist: deliveryStatus, condRating: condRating, user: req.user, username: userGlobal, cartItemCount: cartItemCount, cartItemwiseCount: usercartitemqty, verified: req.user.isverified });
            }
        }
    })
});

app.post('/add-to-cart', shopController.addToCart);
app.post('/remove-from-cart', shopController.removefromCart);

// -------------------End Proudct Details


// --------coomnon functions


let condRatinglList = async function () {
    var conRating = await conRatingmodel.aggregate(
        [
            {
                $project: {

                    "icondrating_Id": "$i_condrating_Id",
                    "i_Cond_Rating": 1,
                    "c_condrating_image": 1,
                    "c_CondName": 1

                }
            }
        ]
    );
    return conRating;

}
let racketmodelList = async function (iUserId) {
    
    var edit = await racketmodel.aggregate([
        {
                $match: {userId: iUserId}
            
            
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
    // console.log(edit);
    return edit;
}
// racketModel document
let rktmodelList = async function () {
    var rktModel = await rktModelmodel.aggregate(
        [
            {
                $project: {
                    "i_Raket_Model_Id": "$i_Raket_Model_Id",
                    "c_Raket_Model": 1
                }
            }
        ]
    );
    return rktModel;
}
// deliveryStatusmodel
let deliveryStatusList = async function () {
    var deliveryStatus = await deliveryStatusmodel.aggregate(
        [
            {
                $project: {
                    "iDelivery_Status": "$i_Delivery_Status",
                    "c_Delivery_Status": 1
                }
            }
        ]
    );
    // console.log(deliveryStatus);
    return deliveryStatus;
}
let seriesList = async function () {
    var series = await seriesmodel.aggregate(
        [
            {
                $project: {
                    "iseriesId": "$i_seriesId",
                    "c_series": 1
                }
            }
        ]
    );
    return series;
}
let manufacturerList = async function () {
    var mnf = await Mfmodel.aggregate(
        [
            {
                $project: {
                    "MnfId": "$i_Mnf_Id",
                    "c_Mnf": 1
                }
            }
        ]
    );
    // console.log(mnf);
    return mnf;
};
// ------------------------------------------------------
//server start
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);

})