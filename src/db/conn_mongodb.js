const mongoose=require('mongoose');
require("dotenv").config();
//creating database
// mongoose.connect("mongodb://localhost:27017/tennisECommerce",{
    //to take mango atlas connection
     mongoose.connect(process.env.MONGODB_URL,{
    // useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection sucessfull.");
}).catch((error)=>{
    console.log(error);
})
