const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
    type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
         unique:true,
    },
    password:{
        type:String,
        require:true,
        
    },
    isEmailVarified:{
type:Boolean,
default:false,
    }

})

module.exports=mongoose.model("user",UserSchema)