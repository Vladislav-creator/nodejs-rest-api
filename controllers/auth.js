const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require('uuid');

const {User} = require("../models/user");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const {SECRET_KEY, BASE_URL} = process.env;

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user){
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = uuidv4();
    const newUser = await User.create({...req.body, password: hashPassword,  verificationCode});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`
    };
    await sendEmail(verifyEmail);

    res.status(201).json( {
        "user":{
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}
 
const verifyEmail = async(req, res)=> {
    const {verificationCode} = req.params;
    const user = await User.findOne({verificationCode});
    if(!user){
        throw HttpError(401, "Email not found")
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});

    res.json({
        message: "Email verify success"
    })
}

const resendVerifyEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email not found");
    }
    if(user.verify) {
        throw HttpError(401, "Email already verify");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verify email send success"
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
    res.json({
        token,
        "user": {
            "email": email,
            "subscription": user.subscription
          }
    })
}
const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({
        message: "No Content"
    })
}
const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}
const updateSubscription = async(req, res)=> {
    
    const {subscription} = req.body
   
    const subscriptions = ["starter", "pro", "business"]
    if(!subscriptions.includes(subscription)){
        throw HttpError(401, "Subscription wrong, the field must be 'starter' or 'pro' or 'business'");  
    }
    const {_id, email } = req.user;
    await User.findByIdAndUpdate(_id, {subscription: subscription});

    res.json({
        email,
        subscription,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateSubscription: ctrlWrapper(updateSubscription),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}