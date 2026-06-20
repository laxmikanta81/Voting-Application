const mongoose=require('mongoose');
require('dotenv').config();
// const mongoURL=process.env.online_db_url;
const mongoURL=process.env.local_db_url;
//const mongoURL = 'mongodb://127.0.0.1:27017/hotels';//link for mongo server

mongoose.connect(mongoURL)

const db=mongoose.connection;
db.on('connected',()=>{
    console.log("connected to mongo server");
});
db.on('error',(err)=>{
    console.log("mongo connection error"+err);
})
db.on("disconnected",()=>{
    console.log('mongo disconnected');
})
module.expot=db;