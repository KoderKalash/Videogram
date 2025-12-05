import { asyncHandler } from "../utils/asyncHandler"
import { apiError } from "../utils/apiError"
import { User } from "../models/user.model"
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullname, email, password } = req.body
    console.log(email);

    // validate details
    /*if (fullname === ""){
        throw new apiError(400, "fullname is required!")
    }*/
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required!")
    }

    // check if user already exists: username, email
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new apiError(409,"User with email or username already exists")
    }
    
    // check for images & avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new apiError(400,"Aatar file is required!")
    }
    
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and referesh token field from response
    // check for user creation 
    // return response if created
    // else retur
})

export { registerUser }