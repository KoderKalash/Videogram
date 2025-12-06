import { asyncHandler } from "../utils/asyncHandler"
import { apiError } from "../utils/apiError"
import { User } from "../models/user.model"
import { cloudinary } from "../utils/cloudinary"
import { apiResponse } from "../utils/apiResponse"


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
    if (existedUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    // check for images & avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new apiError(400, "Aatar file is required!")
    }

    // upload them to cloudinary, avatar
    const avatar = await cloudinary.uploader.upload(avatarLocalPath)
    const coverImage = await cloudinary.uploader.upload(coverImagePath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is required!")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url,
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and referesh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refereshToken" //apart from these two give every detail of user
    )

    // check for user creation
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating the user.")
    }

    // return response if created
    return res.status(201).json(
        new apiResponse(200, "User registered succesfully!")
    )

})

export { registerUser }