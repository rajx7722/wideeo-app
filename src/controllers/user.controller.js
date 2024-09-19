import asyncHandler from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

//after realizing we gonna need a lot of this so why not make a method
const generateAccessAndRefreshTokens = async (userId)=>{
  try {
    const user  = await User.findById(userId) 
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
    
    user.refreshToken = refreshToken;
    //ab isko database me daalna hoga taaki baad me match hopaye
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"something went wrong while generating the access or refresh tokens")
  }
}

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

     console.log(req.files.coverImage);
     
     if(!createdUser){
      throw new ApiError (500 , "something went wrong while registering the user")
     } //removed password and refresh token field from the response

     return res.status(201).json(
      new ApiResponse(200,createdUser,"user registered successfully")
     )
})

const loginUser = asyncHandler(async (req,res)=>{
//get user details from frontend
//validation -not empty
//check if user exists 
//if exists check password if correct
//if wrong:wrong credentials
//if correct then gen access and refresh token and send both to user
//via cookies (secure)

const {username , email ,password} = req.body

if(!username || !email){
  throw new ApiError(400,"username is required")
}

const user = await User.findOne({
  $or:[{username},{email}]
})

if(!user){
  throw new ApiError(404,"user doesnt exist")
}

const isPasswordValid= await user.isPasswordCorrect(password)
if(!isPasswordValid){
  throw new ApiError(401,"invalid user credentials")
}

const{accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)
//now send it in cookies

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//whenever we send cookies we make options (an object)

const options = {
  httpOnly: true,
  secure: true,
  //now these can only be modified by the server
}
return res
.status(200)
.cookie("refreshToken",refreshToken,options)
.cookie("accessToken",accessToken,options)
.json(
  new ApiResponse(
    200,{user: loggedInUser,accessToken,refreshToken},"user logged in successfullu"
  )
)
})

const logoutUser = asyncHandler(async (req,res)=>{
  //clear cookies
  //reset refresh token
  //remove from database
})

export {registerUser , loginUser, logoutUser}