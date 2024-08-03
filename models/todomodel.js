const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const TodoSchema=new Schema({
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
},

{
    timestamps:true,
})

module.exports=mongoose.model("todo",TodoSchema)