const USER = require("../models/userModel")
const jwt = require('jsonwebtoken')

const adminAuth = async(req,res,next)=>{
    try {
       const refreshToken = req.cookies.refreshTokenCookie
       if(!refreshToken){
        return res.status(401).json({message:"Session expired, log in again"})
       }

       jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET, async(err,user)=>{
            if(err){
                return res.status(401).json({message:"Invalid token"})
            }

            const userData = await USER.findOne({email:user.email})
            if(!userData.isAdmin){
                return res.status(401).json({message:"You are not an admin"})
            }

            next()
       })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = adminAuth