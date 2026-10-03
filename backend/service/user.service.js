const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
// require("dotenv").config();

const registerUser = async ({name, emailId, password}) => {

    const userExist = await userModel.findOne({emailId});
    if(userExist){
        const error = new Error("User with this mailId alreay exists");
        error.statuscode=400;
        throw error;
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const userData={name,emailId,password:hashedPassword};
    const user = await userModel.create(userData);
    return user;
    
}

const loginUser = async ({emailId,password}) => {

    const user = await userModel.findOne({emailId:emailId});
    
    if(!user){
        const error = new Error("Invaliid Email ID");
        error.statuscode = 400;
        throw error;
    }

    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        const error = new Error("Invaliid Credentials");
        error.statuscode = 400;
        throw error;
    }
    
    const token = jwt.sign(
        {id:user._id, emailId:user.emailId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );

    return {token:token};

}

module.exports = {registerUser, loginUser};