const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const SessionSchema=new Schema({
    username:String,
},
{strict:false,});



const Sessionmodel=mongoose.model("session",SessionSchema);
module.exports=Sessionmodel;