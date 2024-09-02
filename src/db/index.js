import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
       //mongoose sends you a return object and we hold it here
       console.log(`\n mongoDB connected! DB HOST ${connectionInstance.connection.host}`);
       
    } catch (error) {
     console.log("MONBGODB CONNECTION ERROR:",error)   
     process.exit(1)
    }
}
export default connectDB
