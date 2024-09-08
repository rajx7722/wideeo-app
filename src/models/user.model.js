import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({

    username:{
        type: String,
        required : true,
        unique : true,
        lowercase :true,
        trim :true,
        index : true,
    },
    email :{
        type: String,
        required : true,
        unique : true,
        lowercase :true,
        trim :true,
    },
    fullname:{
        type: String,
        required : true,
        trim :true,
        index : true,
    },
    avatar:{
        type: String, //cloudinary url
        required: true,
    },
    coverImage:{
        type: String, //cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, 'password is required']
    },
    refreshToken:{
        type:String
    },
},{ timestamps: true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
        
    this.password  = await bcrypt.hash(this.password,10)
    next()
        
})
//https://mongoosejs.com/docs/middleware.html#pre
//used fn here cuz arror fn se context ni milta => cannot use this. from the document




//now we'll make a custom method , when using predefined methods we use userSchema.models.<predefined name> ,
//now instead of predefined name we'll use the name we desire and viola its a new method in the schema

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User", userSchema)