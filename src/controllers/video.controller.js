import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if (!(title && description)) {
        throw new ApiError(401, "Please provide title and description");
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(404, "Video File not uploaded");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = "";
    if (thumbnailLocalPath)
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || (thumbnail !== "" && !thumbnail)) {
        throw new ApiError(
            500,
            "Something went wrong while uploading video ans/or thumbnail on Cloudinary"
        );
    }

    const upload = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        owner: req.user?._id,
    });

    if (!upload) {
        throw new ApiError(500, "Something went wrong while uploading video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, upload, "Video Uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    // can also add code to store this video to user watch history
    if (!isValidObjectId) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(500, "Something went wrong while fetching Video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video Fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail

    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    const currentVideo = await Video.findById(videoId);

    if (currentVideo?.owner.toString() != req.user?._id) {
        throw new ApiError(400, "Only Owners can edit video");
    }

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(
            401,
            "All Fields Cannot be empty, atleast one field needs to be changes"
        );
    }

    const newTitle = title ? title : currentVideo?.title;
    const newDescription = description
        ? description
        : currentVideo?.description;

    const newThumbnail = currentVideo?.thumbnail;

    if (thumbnailLocalPath) {
        const thumbnailCloundinary =
            await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnailCloundinary.url)
            throw new ApiError(400, "Error while updating thumbnail");

        newThumbnail = thumbnailCloundinary.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title: newTitle,
            description: newDescription,
            thumbnail: newThumbnail,
        },
    });

    if (!updatedVideo) {
        throw new ApiError(500, "Error while updating video details");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Video Details updated successfully"
            )
        );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    if (!isValidObjectId) {
        throw new ApiError(400, "Invalid video Id");
    }

    const curvideo = await Video.findById(videoId);
    if (!curvideo) {
        throw new ApiError(500, "Something went wrong while fetching video");
    }

    if (curvideo.owner != req.user._id) {
        throw new ApiError(401, "Only Owner can Update the delete of video ");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(500, "Something went wrong while fetching Video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video DEleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(500, "Something went wrong while fetching video");
    }

    if (video.owner != req.user._id) {
        throw new ApiError(401, "Only Owner can Update the details of video ");
    }

    const setVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video?.isPublished,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                setVideo,
                `Video Pusblication status set to: ${setVideo.isPublished}`
            )
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
