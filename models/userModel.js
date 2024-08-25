const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

const USER = mongoose.model('user',userSchema)

module.exports = USER