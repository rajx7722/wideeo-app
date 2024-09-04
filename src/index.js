import dotenv from "dotenv"
import connectDB from './db/index.js'
import app from './app.js'

dotenv.config({
    path:'./env'
})

connectDB()//async fn always returns a promise
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port:${process.env.PORT}`);  
    })
})
.catch((error)=>{
    console.log("mongoDB connection failed!!",error);
})





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