const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt=require("bcrypt");
const nodemailer=require("nodemailer");
const transport=require("nodemailer-sendgrid-transport");
const crypto=require("crypto");
const { ObjectId } = require("mongodb");

const transporter = nodemailer.createTransport(
    transport({
      auth: {
        api_key:
          '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'
      }
    })
  );

exports.getLogin = (req, res, next) => {
    res.render("auth/login",{
        pageTitle:"Login",
        errorMessage:'',
        validationErrors:[],
        oldInputs:{
            email:'',
            password:''
        }
    });
}

exports.postLogin = async (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.render("auth/login",{
            pageTitle:'Login',
            errorMessage:'',
            oldInputs:{
                email:email,
                password:password
            },
            validationErrors:errors.array()
        })
    }
    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.render("auth/login", {
                pageTitle: 'Login',
                errorMessage: "Invalid email or password!",
                validationErrors: [],
                oldInputs: {
                    email: email,
                    password: password
                }
            })
        }
        const doMatch = await bcrypt.compare(password, user.password)

        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                console.log(err);
                res.redirect("/");
            });
        }
        return res.render("auth/login", {
            pageTitle: 'Login',
            errorMessage: "Invalid email or password!",
            validationErrors: [],
            oldInputs: {
                email: email,
                password: password
            }
        })
    } catch (err) {
        console.log(err);
    }

}
exports.getSignup = (req, res, next) => {
    res.render("auth/signup",{
        pageTitle:"Sign up",
        oldInputs:{
            email:'',
            password:'',
            confirmPassword:''
        },
        validationErrors:[]
    })
}
exports.postSignup = async (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.render("auth/signup",{
            pageTitle:"Sign up",
            oldInputs:{
                email:email,
                password:password,
                confirmPassword: confirmPassword,
                firstName: firstName,
                lastName:lastName,
                
            },
            validationErrors:errors.array()
        })
    }
    try {
        const hashedPass = await bcrypt.hash(password, 12)

        const user = new User({
            email: email,
            password: hashedPass,
            firstName: firstName,
            lastName: lastName,
        });
        await user.save();

        res.redirect("/login");
    } catch(err){
    console.log(err);
}
}

exports.getReset=(req,res,next)=>{
    res.render("auth/reset-password",{
        pageTitle:"Reset password",
        errorMessage:''
    })
}

exports.sendResetRequest=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
           return res.redirect("/reset");
        }
        const token=buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.render("auth/reset-password",{
                    pageTitle:'Reset password',
                    errorMessage:"Email does not exist, try again!"
                })
            }
            user.resetToken=token;
            user.resetTokenExpiration=Date.now()+3600000;
            return user.save();
        })
        .then(result=>{
         res.redirect("/login");
         transporter.sendMail({
            to:req.body.email,
            from:"jihadabdlghani@gmail.com",
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}/">link</a> to set a new password.</p>
            `
         }); 
        })
        .catch(err=>{
            console.log(err);
        })
        })
}
exports.getNewPassword=async (req,res,next)=>{
    const token = req.params.token;
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        if (!user) {
            return res.render("auth/new-password", {
                pageTitle: "Set new password",
                errorMessage: "Token has expired, request new one",
                validationResult: [],
                passwordToken: '',
                userId: new ObjectId()
            })
        }
        res.render("auth/new-password", {
            pageTitle: "Set new password",
            errorMessage: '',
            passwordToken: token,
            userId: user._id,
            validationResult: []
        })
  
    } catch(err){
    console.log(err);
    };
}

exports.setNewPassword=async (req,res,next)=>{
    const passwordToken=req.body.passwordToken;
    const userId=req.body.userId;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors){
        return res.render("auth/new-password",{
            pageTitle:"Set new password",
            errorMessage:'',
        passwordToken:token,
        userId:user._id.toString(),
        validationResult:errors.array()
        })
    }   
    let resetUser;
    try {
        const user=await User.findOne({ _id: userId, resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
            
                resetUser = user;
                const hashedPass=await bcrypt.hash(password, 12);
    
                resetUser.password = hashedPass;
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                await resetUser.save();
            
                res.redirect("/login");
        
    } catch(err){
    console.log(err);
}
}

exports.postLogout = async (req, res, next) => {
    try{
    await req.session.destroy();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        }
};