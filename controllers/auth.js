const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {User} = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user){
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
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
    const user = req.user
    console.log(user);
    const {subscription} = req.body
    console.log(subscription);
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
}