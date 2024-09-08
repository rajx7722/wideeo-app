import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

// router.route("/register").post(registerUser)
//this was fine but we want a middleware multer that we created for handling file uploads

router.route("/register").post(upload.fields([
    {
        name: "avatar", //has to be communicated with the frontend
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)

export default router