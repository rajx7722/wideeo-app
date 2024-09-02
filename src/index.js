import dotenv from "dotenv"
import connectDB from './db/index.js'

dotenv.config({
    path:'./env'
})

connectDB()






/* this is a approach where index file is cluttered, so well do it in db ka index
;(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port: ${process.env.PORT}`)
       })

    } catch (error) {
        console.error("ERROR")
    }
})()
    */