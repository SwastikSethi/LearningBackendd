import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// when res is not used, it is replaced with _
const verifyJWT = asyncHandler(async (req, _, next) => {
    // try {
        console.log(req.cookies)
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        console.log("token " , token.type);
        if (!token) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    // } catch (error) {
    //     throw new ApiError(401, error?.message || "Invalid Access Token ");
    // }
});

export { verifyJWT };
