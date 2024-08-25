const USER = require('../models/userModel')
const jwt = require('jsonwebtoken')

const userAuth = async(req,res,next) =>{
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

                if(!userData){
                    return res.status(400).json({message:"Something went wrong"})
                }

                if(!userData.isVerified){
                    return res.status(400).json({message:"Account not verified yet"})
                }
    
                next()
           })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = userAuth