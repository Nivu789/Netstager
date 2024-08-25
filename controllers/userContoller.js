const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const  sendVerificationEmail = require('../helpers/sendVerificationEmail')
const USER = require('../models/userModel')

const registerUser = async(req,res,next) =>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"You missed out on something"})
        }

        const emailExist = await USER.findOne({email})
        console.log(emailExist)
        if(emailExist){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1d'})

        const user = await USER.create({
            email,
            password:hashedPassword,
            verificationToken:token
        })

        await sendVerificationEmail(email,token)

        return res.status(200).json({message:"Please verify your email"})

    } catch (error) {
        console.log(error)
        next(error)
    }
}


const verifyEmail = async(req,res,next) =>{
    try {

        const {token} = req.query
        let decoded;
        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET)
        } catch (error) {
            if(error.name=="JsonWebTokenError"){
                return res.status(401).json({message:"Invalid token"})
            }
        }
        
        

        const userValid = await USER.findOne({email:decoded.email})
        if(!userValid){
            return res.status(401).json({message:"Verification failed"})
        }

        userValid.isVerified = true
        userValid.verificationToken = null
        await userValid.save()

        return res.status(200).json({message:"You are verified, now you can login"})

    } catch (error) {
        console.log(error)
        next(error)
    }
}


const loginUser = async(req,res,next) =>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const user = await USER.findOne({email})
        if(user && !user.isVerified){
            return res.status(401).json({message:"You are not verified yet"})
        }else if(user && user.isVerified){
            const verifyPass = await bcrypt.compare(password,user.password)
            if(!verifyPass){
                return res.status(400).json({message:"Invalid credentials"})
            }

            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"20s"})
            const refreshToken = jwt.sign({email},process.env.JWT_REFRESH_SECRET,{expiresIn:"1d"})
            
            res.cookie('accessTokenCookie',token,{
                httpOnly:true,
                secure:true,
                maxAge:20*1000
            })

            res.cookie('refreshTokenCookie',refreshToken,{
                httpOnly:true,
                secure:true,
                maxAge:24*60*60*1000
            })

            return res.status(200).json({accessToken:token,refreshToken})
        }else{
            return res.status(400).json({message:"Coudn't find an account with that email"})
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const refreshToken = async(req,res,next) =>{
    try {
       const refreshToken = req.cookies.refreshTokenCookie
       
       if(!refreshToken){
        return res.status(401).json({message:"Refresh token not found - you will be logged out"})
       }

       jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,email)=>{
        if(err){
            return res.status(401).json({message:"Invalid refresh token"})
        }

        const freshAccessToken = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"20s"})

        res.cookie('accessToken',freshAccessToken,{
            httpOnly:true,
            secure:true,
            maxAge:20*1000
        })

        return res.status(200).json({message:"Token got refreshed"})

       })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    refreshToken
}