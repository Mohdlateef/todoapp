const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session=require("express-session");
const mongodbSession=require("connect-mongodb-session")(session);

// constants
const app = express();
const mongouri = process.env.mongose_uri;
const port = process.env.port;
const store=new mongodbSession({
  uri:mongouri,
  collection:"session"
})

// middlewares
const usermodel = require("./models/usermode");
const usermode = require("./models/usermode");
const isAuth=require("./middlewares/isAuthmiddleware")
// file exports
const { uservalidation, loginvalidation, isEmailValidate } = require("./utils/authutils");
const ConnectMongoDBSession = require("connect-mongodb-session");
// global middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret:process.env.SECRET_KEY,
    store:store,
    resave:false,
    saveUninitialized:false,
  })
)
// mongodbconnection

mongoose
  .connect(mongouri)
  .then(() => {
    console.log("mogodbconected sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

// .........Apis......
// Home
app.get("/", (req, res) => {
  return res.render("homepage");
});

// registration
app.get("/register", async (req, res) => {
  return res.render("registration");
});

app.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;

  // datavalidation
  try {
    await uservalidation({ name, email, username, password });
  } catch (error) {
    res.status(400).json({ error: error });
  }

  try {
    //  check email present in db
    let emailExist = await usermode.findOne({ email });

    if (emailExist) {
      return res.status(400).json("Email already exist");
    }

    // check username is present in db

    let usernameExist = await usermode.findOne({ username: username });
    console.log(usernameExist, "line 74");
    if (usernameExist) {
      return res.status(400).json("Username already exists");
    }

    //haspassword
    const haspassword = await bcrypt.hash(password, Number(process.env.SALT));
    // store user info in db
    const userObj = new usermode({
      name,
      email,
      username,
     password:haspassword,
    });

    const userDb = await userObj.save();
    return res.status(201).render("loginpage");
  } 
  catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
});

//login
app.get("/login", (req, res) => {
  return res.render("loginpage");
});

app.post("/login", async (req, res) => {
  let { loginId, password } = req.body;

try{
  console.log("ues")

// Datavalidation
await loginvalidation({loginId,password})

// find it's email or username
let userDb={}
 if(isEmailValidate({key:loginId})){
  userDb=await usermode.findOne({email:loginId})
 }
 else{
  userDb =await usermode.findOne({username:loginId});
 }
//  console.log("userDb in login" ,userDb)
if(!userDb){
  return res.status(400).json("user not Found please register first");
}

// compare passwords
let isMatch=await bcrypt.compare(password,userDb.password)
if(!isMatch){
  return res.status(200).json("incorrect password")
}

// sessioininit
req.session.isAuth=true;
req.session.user={
  userid:userDb._id,
  username:userDb.username,
  email:userDb.email,

}
  return res.redirect("dashboard")

}catch(error){
return res.status(200).json({error:error})
}

})

// Dashboard page

app.get("/dashboard",isAuth,(req,res)=>{
  return res.render("dashboard");
})

// logout
app.post("/logout",isAuth,(req,res)=>{
  req.session.destroy((error)=>{
    if(error){
      return res.status(500).json(error)
    }else{
      return res.status(200).json("logout sucessfully")
    }
  })
})
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
