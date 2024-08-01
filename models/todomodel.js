const mongoose=require("mongoose");
const Schema=mogoose.schema;


let todoschema=new Schema({
    todo:{
        type:String,
        require:true,
        minLength:3,
        maxLength:100,
        trim:true,
    },
    username:{
        type:String,
        require:true
    },
})

module.exports=mongoose.model("user",todoschema)