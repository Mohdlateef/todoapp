const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const AccessSchema=new Schema({
    sessionid:{
        type:String,
    },
    time:{
        type:String,
    }
})

const acessmodel=mongoose.model("acess",AccessSchema);
module.exports=acessmodel;