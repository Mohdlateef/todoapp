const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

// constants
const app = express();
const MOGO_URI = process.env.MOGO_URI;
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: MOGO_URI,
  collection: "sessions",
});

// middlewares
const usermodel = require("./models/usermode");
const usermode = require("./models/usermode");
const isAuth = require("./middlewares/isAuthmiddleware");
// file exports
const {
  uservalidation,
  loginvalidation,
  isEmailValidate,
} = require("./utils/authutils");
const ConnectMongoDBSession = require("connect-mongodb-session");
const todomodel = require("./models/todomodel");
const Sessionmodel = require("./models/sessionmodel");
const ratelimiting = require("./middlewares/ratelimiting");
// global middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
// mongodbconnection

mongoose
  .connect(MOGO_URI)
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
    // console.log(usernameExist, "line 74");
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
      password: haspassword,
    });

    const userDb = await userObj.save();
    return res.status(201).render("loginpage");
  } catch (error) {
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

  try {
    // console.log("ues")

    // Datavalidation
    await loginvalidation({ loginId, password });

    // find it's email or username
    let userDb = {};
    if (isEmailValidate({ key: loginId })) {
      userDb = await usermode.findOne({ email: loginId });
    } else {
      userDb = await usermode.findOne({ username: loginId });
    }
    //  console.log("userDb in login" ,userDb)
    if (!userDb) {
      return res.status(400).json("user not Found please register first");
    }

    // compare passwords
    let isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.status(200).json("incorrect password");
    }

    // sessioininit
    req.session.isAuth = true;
    req.session.user = {
      userid: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };
    return res.redirect("dashboard");
  } catch (error) {
    return res.status(200).json({ error: error });
  }
});

// logout
app.post("/logout", isAuth,(req,res)=>{
req.session.destroy((err)=>{
  if(err)
  {
    return res.send({
      status:200,
      message:"logout unsecussfull",
      err:err,
    })
  }
  else{
    return res.send({
      status:200,
      message:"logout secussfull"
    })
  }
})

})
// Dashboard page

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboard");
});

// logout
app.post("/logout", isAuth, async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json(error);
    } else {
      return res.status(200).json("logout sucessfully");
    }
  });
});

//logout from all devices
app.post("/logout-from-all",isAuth, async(req,res)=>{
  const username=req.session.user.username;
// console.log(username);
try {
  const userDb=await Sessionmodel.deleteMany({
    "session.user.username":username,
  });
  console.log(userDb,199)
  return res
  .status(200)
  .json(`Logout from ${userDb.deletedCount} devices successfull`);
} catch (error) {
  return res.status(500).json("logout unsecussfull");
}

})
//createapi
app.post("/create-items", isAuth,ratelimiting, async (req, res) => {
  let todoData = req.body.todo;
  // console.log(todoData,"todo175")

  if (todoData.length > 100 || todoData.length < 3) {
    return res.status(400).json("Length should be greater than 3 and less 100");
  }
  console.log(req.body.todo);
  try {
    const todoObj = new todomodel({
      todo: todoData,
      username: req.session.user.username,
    });
    const tododb = await todoObj.save();
    // console.log(tododb)
    return res.send(" todo created");
  } catch (error) {
    console.log(error);
    return res.send("failed");
  }
});

// readtodo
app.get("/read_iteams", isAuth, async (req, res) => {
  let username = req.session.user.username;
  const SKIP=Number(req.query.skip)||0;
  const LIMIT=5;
  // console.log(SKIP,236);

  try {
    // let tododb = await todomodel.find({ username: username });
    const tododb=await todomodel.aggregate([
      {
        $match:
        {username:username}
      },
      {$skip:SKIP},
      {$limit:LIMIT},
    ])
   console.log(tododb.length,123)
    
  
    if (tododb.length===0) 
    {
      console.log(tododb.length)
    return res.send({
      message:"wer are failed"
    })
    }

    return res.send({
      tododb: tododb,
    })
  } catch (err) {
    return res.send({
      status: 500,
      message: "internal sever error",
      err: err,
    });
  }
});

// edit TODOIteams
app.post("/edit_iteam", isAuth, async (req, res) => {
  const _id = req.body._id;
  const editText = req.body.editText;

  const sesUsername = req.session.user.username;
  try {
    const todoDb = await todomodel.findOne({ _id });
    if (!todoDb) {
      return req.send({
        status: 400,
        message: "user Not found",
      });
    }
    const username = todoDb.username;
    if (sesUsername !== username) {
      return res.send({
        status: 202,
        message: "unauthrosied request",
      });
    }
    const iteam = await todomodel.findOneAndUpdate(
      { _id: _id },
      { todo: editText }
    );

    return res.send({
      status: 201,
      message: "todo is edited sucessfully",
    });
  } catch (error) {
    console.log(error, 246);
    return res.send({
      status: 500,
      message: "internal server error",
      error: error,
    });
  }
});

// delete iteam
app.post("/delete_iteam", isAuth, async (req, res) => {
  const _id = req.body._id;
  console.log(_id,303)
  const sesUsername = req.session.user.username;
  try {
    const todoDb = await todomodel.findOne({ _id });
    if (!todoDb) {
      return res.send({
        status: 400,
        message: "No todo find",
      });
    }
    const username = todoDb.username;
    if (sesUsername !== username) {
      return res.send({
        status: 202,
        message: "unauthorised access",
      });
    }

    await todomodel.findOneAndDelete({ _id});

    return res.send({
      status: 201,
      message: "todo is edited sucessfully",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "internal server error",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
