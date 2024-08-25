const TEAM = require("../models/teamModel")
const USER = require('../models/userModel')

const createTeam = async(req,res) =>{
    try {
       const {teamname,userIds} = req.body
       
       if(!teamname || !userIds || !Array.isArray(userIds)){
        return res.status(400).json({message:"teamname and userIds are required"})
       }

       let flag = true
       userIds.map((userId)=>{
        if(userId.length!==24 || typeof userId !=='string'){
            flag=false
        }
       })

       if(!flag){
        return res.status(400).json({message:"Invalid user ids"})
       }

       const validUsers = await USER.find({_id:{$in:userIds}})

       if(validUsers.length!==userIds.length){
        return res.status(400).json({message:"Provided users were not found"})
       }

       await TEAM.create({
        teamName:teamname,
        users:userIds
       })

       return res.status(200).json({message:"Team formed successfully"})

    } catch (error) {
        console.log(error)
    }
}

const getTeams = async(req,res) =>{
    try {
        const teams = await TEAM.find({})
        return res.status(200).json({teams})
    } catch (error) {
        console.log(error)
    }
}


const assignTask = async(req,res) =>{
    try {
       const teamId = req.params.teamId
        const {taskname,description} = req.body

        if(teamId.length!==24||typeof teamId!='string'){
            return res.status(400).json({message:"Invalid team id"})
        }

       const teamExist = await TEAM.findById({_id:teamId})
       if(!teamExist){
        return res.status(400).json({message:"No such team found"})
       }

       if(!taskname || !description){
        return res.status(400).json({message:"task name and description is required"})
       }

       const newTask = {
        taskName:taskname,
        description:description,
       }

       teamExist.tasks.push(newTask)

       await teamExist.save()

       return res.status(200).json({message:"Task assigned successfully"})

    } catch (error) {
        console.log(error)
    }
}


const getTasks = async(req,res) =>{
    try {
        const teamId = req.params.teamId

        if(teamId.length!==24||typeof teamId!='string'){
            return res.status(400).json({message:"Invalid team id"})
        }

        const teamExist = await TEAM.findById({_id:teamId})
        if(!teamExist){
        return res.status(400).json({message:"No such team found"})
       }

       return res.status(200).json({tasks:teamExist.tasks})

    } catch (error) {
        console.log(error)
    }
}


const updateTaskStatus = async(req,res) =>{
    try {
        const {teamId} = req.params
        const {status,taskId} = req.body

        if(!taskId || !status){
            return res.status(400).json({message:"Status and taskId required"})
        }


        if(teamId.length!==24||typeof teamId!='string'){
            return res.status(400).json({message:"Invalid team id"})
        }

        if(taskId.length!==24||typeof taskId!='string'){
            return res.status(400).json({message:"Invalid task id"})
        }

        const teamExist = await TEAM.findById({_id:teamId})
        if(!teamExist){
        return res.status(400).json({message:"No such team found"})
       }

       if(status=='pending' || status=='completed'){
        
        const taskToUpdate = await TEAM.findOneAndUpdate({_id:teamId,'tasks._id':taskId},{$set:{'tasks.$.status':status}})
        if(taskToUpdate){
            return res.status(200).json({message:"Task status updated"})
        }else{
            return res.status(400).json({message:"Invalid task id"})
        }
       
        }
    
        return res.status(400).json({message:"Invalid status was provided"})
 

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createTeam,
    getTeams,
    assignTask,
    getTasks,
    updateTaskStatus
}