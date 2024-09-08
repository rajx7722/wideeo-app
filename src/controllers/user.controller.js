import asyncHandler from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation - not empty
    //check if user already exists:check by username or email
    //check if avatar, check for images
    //upload them to cloudinary,avatar check on cloudinary
    //create userObject - create entry in Db
    //remove password and refreshtoken filed from response
    //check for userCreation
    //return response 

    //1 if data form ya json se hai to req.body , if from url then well se later on
    const {fullname,email,username,password} = req.body
    console.log("email",email);

    if (!username || username.trim() === "") {
        throw new ApiError(400, "Username is required");
      }
    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
      }
    if (!fullname || fullname.trim() === "") {
        throw new ApiError(400, "Full name is required");
      }
    
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }
    //as req.body gives data , but in routes we've injected middleware so this middleware also give acces to 
    //req.files (from multer),it just adds some fields
    //now we want to get the already uploaded files location form multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required")
    }

    //now upload on cloudinary
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImagePath)

     if(!avatar){
        throw new ApiError(400,"avatar file is required")
     }

     const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
     })

     const createdUser = await User.findById(user._id).select("-refreshToken -password")

     if(!createdUser){
      throw new ApiError (500 , "something went wrong while registering the user")
     } //removed password and refresh token field from the response

     return res.status(201).json(
      new ApiResponse(200,createdUser,"user registered successfully")
     )
})


export {registerUser}