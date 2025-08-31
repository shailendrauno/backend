import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudenary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        // upload on cloudenary
       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploade
        console.log("Upload succesfully", response.url);
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the localy save temp file
        return null
        
    }
}

export {uploadOnCloudenary}