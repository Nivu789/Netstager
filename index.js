const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRouter = require('./routes/userRoute')
const cookieParser = require('cookie-parser')
const teamRouter = require('./routes/teamRoute')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

mongoose.connect(process.env.DB_URI)
.then(()=>console.log("database connected"))
.catch(()=>console.log("failed in connecting database"))

app.use(express.json())
app.use(cookieParser())

app.use('/',userRouter)

app.use('/teams',teamRouter)

app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log("Server running")
})