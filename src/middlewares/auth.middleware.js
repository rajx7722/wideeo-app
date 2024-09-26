import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
//token ka access kaise lenge? req ke paas cookies ka access tha na

export const verifyJWT = asyncHandler(async (req,res,next)=>{

try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    //token aaagya isse
    if(!token){
        throw new ApiError(401,"unauthorized request")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        // TODO: discuss about frontend
        throw new ApiError(401,"invalid Access Token")
    }
        req.user = user;
        //By calling next(), you're essentially allowing the request to continue through the 
        //middleware stack, and any modifications made to req (like req.user) are carried along with it.
        //when routes call the verifyJWT it then calls the logout user => we can use req.user in logoutUser
        next()
    
} catch (error) {
    throw new ApiError(401,error?.message || "invalid Access Token")
}
})