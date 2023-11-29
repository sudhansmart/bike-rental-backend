const express = require ('express');
const dotenv =require('dotenv');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());

// Connecting to MongoDB
mongoose
.connect(process.env.DB_Url,{})
.then(()=>{
    console.log("MongoDb is Connected")
})
.catch((err)=>{
        console.log("MongoDb Not Connected",err.message)
})

app.use('/signin',require('./routes/signin'));
app.use('/login',require('./routes/login'))
app.use('/bikelist',require('./routes/bikes'))





app.listen(process.env.PORT,()=>{
    console.log(`Server Running On PORT ${process.env.PORT}`)
})