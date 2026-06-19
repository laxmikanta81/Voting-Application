const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const { is } = require('type-is');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },age:{
        type:Number,
        required:true
    },email:{
        type:String,
        unique:true
    },mobile:{
        type:String,
        required:true
    },adress:{
        type:String,
        required:true
    },adhaarNumber:{
        type:String,
        required:true
    },role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },isVoted:{
        type:Boolean,
        default:false
    },password:{
        type:String,
        required:true,
    }
});
const User=mongoose.model('User',userSchema);
module.exports=User;