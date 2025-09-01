import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudenary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler( async (req, res) =>{
    // get user detail from frontend
    // validation - not empty
    // check if user already exists - username/email
    //check for image file {avtar}
    //upload them on cloudenary, avtar
    //validate upload or not
    // create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    // return response


    const {fullName, email, username, password} = req.body
    // console.log("email:", email);
    
    if(
        [fullName, email, username, password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required")
    }

   const existedUser = await User.findOne({
        $or: [ {username},  {email} ]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username is exist already")
    }
    // console.log(req.files);
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0].path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)[
      coverImageLocalPath = req.files.coverImage[0].path
    ]

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }


   const avatar = await uploadOnCloudenary(avatarLocalPath)
   const coverImage = await uploadOnCloudenary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avtar file is required")
    }

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "somthing went wront while register user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User create succesfully")
  )

})


const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    // username or email
    //find the user
    // check pass
    //access and refresh token
    //send cookie

    const {email, username, password} = req.body
    if(!username || !email){
      throw new ApiError(400, "username or email is required")

    }

   const user = await User.findOne({
      $or:[{username}, {email}]
    })

    if(!user){
      throw new ApiError(404, "user does not exist")
    }

   const isPasswordValid = await  user.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401, "Invalid user creditial")
    }
})



export {registerUser}