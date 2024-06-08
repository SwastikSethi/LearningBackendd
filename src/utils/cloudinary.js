import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) =>{
    try {
        if(!localPath) return null
        
        //upload file
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        // file has been uploaded
        console.log("File has been uploaded on cloudinary", response.url)
        return response
        
    } catch (error) {
        fs.unlinkSync(localPath); // remove the local file when upload operation failed
        return null;
    }
}

export {uploadOnCloudinary}