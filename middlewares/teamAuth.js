const TEAM = require("../models/teamModel")
const jwt = require('jsonwebtoken')
const USER = require('../models/userModel')

const teamAuth = (req,res,next) =>{
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

            if(userData.isAdmin){
                next()
            }


            const teamId = req.params.teamId
            const teamData = await TEAM.findById({_id:teamId})

            if(!teamData){
                return res.status(400).json({message:"No such team found"})
            }

            console.log(teamData.users)

            console.log(userData._id)

            const userInTeam = teamData.users.findIndex((id) => id.toString() === userData._id.toString())

            console.log(userInTeam)

            if(userInTeam!==-1){
                next()
            }else{
                return res.status(401).json({message:"You don't belong to this group hence can't perform this action"})
            }

            
       })

    } catch (error) {
        console.log(error)
        next(error)
    }
}


module.exports = teamAuth