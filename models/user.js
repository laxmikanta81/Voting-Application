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

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // assign back
    next();
  } catch (error) {
    return next(error);
  }
});
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(error){
        throw error;
    }
}

const User=mongoose.model('User',userSchema);
module.exports=User;