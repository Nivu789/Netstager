const errorHandler = (err,req,res,next) =>{
    try {
        return res.status(500).json({message:err.message || "Internal Server Error"})
    } catch (error) {
        console.log(error)
    }
}

module.exports = errorHandler