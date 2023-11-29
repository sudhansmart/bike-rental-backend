const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

async function CheckUser(email){
    try {
        const user = await User.findOne({email:email})
        if(user){
            return true;
        }
        return false;
    } catch (error) {
        return "Server Busy" ;
    }
}


async function AuthenticateUser(email,password){
    try {
        const usercheck = await User.findOne({email:email});
        const validpassword = await bcrypt.compare(password,usercheck.password)
        
        if (validpassword){
            const token = jwt.sign({email},process.env.login_SecretKey);
            const response = {
                id:usercheck.id,
                name :usercheck.name,
                email:usercheck.email,
                token:token,
                status:true,
                role:usercheck.role

            }
            await User.findOneAndUpdate({email:usercheck.email},{$set:{token:token}},{new:true})
            return response
        }

        else{ return "Invalid Username or Password"}
    } catch (e) {
        console.log("error occured in authentication : ",e)
        return "Server Busy"
    }
}
module.exports = {CheckUser,AuthenticateUser}