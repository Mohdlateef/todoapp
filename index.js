const express=require("express");
const app=express();
const mongoose=require("mongoose");
require("dotenv").config()

// const userSchema=require("./userSchema")
// middlewares
const usermodel=require("./models/usermode");
const usermode = require("./models/usermode");


// fileexports
const { uservalidation } = require("./utils/authutils");

app.set("view engine" ,"ejs")
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(express.json);

// mongodbconnection

let mongouri=process.env.mongose_uri;
mongoose.connect((mongouri))
.then(()=>{
    console.log("mogodbconected sucessfully")
}).catch((err)=>{
    console.log(err)
})
// .........Apis......
// Home
app.get('/',(req,res)=>{
    console.log("we are running");
    // return res.send("we are ready to go")
    return res.render("homepage");
})

// registration
app.get('/register',async (req,res)=>{

    // const userobj=new usermodel({
    //     name:'umer',
    //     email:"lateef1231aba@123",
    //     username:"abfff",
    //     password:"22342"
    // })
    // const userDb=await userobj.save();
    try{let userdb=await(usermodel.findOne({email:"lateefah123@gmail.com"}))
console.log(userdb)}
    catch(error){
        console.log(error)
    }
    
    return res.render("registration")
})
app.post('/register',async(req,res)=>{
    let {name,email,username,password}=req.body;
    try {await uservalidation({name,email,username,password});
}
catch(error){
return res.status(400).json(error)
}


    let userObj=new usermodel({
        name:name,
        email:email,
        username:username,
        password:password,
    })
    let userdb=await userObj.save()
  
    res.redirect("/login")
})
 
//login
app.get('/login',(req,res)=>{
    return res.render("loginpage")
    
})
app.post('/login',async(req,res)=>{
  let {loginId,password}=req.body;
  console.log(typeof password);
  if(!loginId||!password)
  {
    return res.status(400).json("Missing email/username")
  }
 if(typeof loginId ==String)
  {
    return res.status(400).json("email/username should be in string format");

  }
  else if(typeof password == String)
  {
    return res.status(400).json("Password should be in string format");

  }
  try{
    let userDb={};
    userDb=await(usermode.findOne({email:loginId}))
   if(userDb)
   {
    return res.send("login sucessfull")
    
   }
  }
  catch(error){
    return  res.status(500).json({
        message:"internal server error",error:error
    })
  }
 
})



const port =process.env.port;


app.listen(port,()=>{

    console.log(`server is running on port ${port}`)
})