const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    taskName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    }
})


const teamSchema = mongoose.Schema({
    teamName:{
        type:String,
        required:true
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        }
    ],
    tasks:
        {
            type:[taskSchema]
        }
    
})

const TEAM = mongoose.model('team',teamSchema)

module.exports = TEAM