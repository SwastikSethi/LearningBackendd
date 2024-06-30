import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Invalid videoId");
    }

    const like = await Like.findOne({
        videoId: videoId,
        likedBy: req.user?._id,
    });

    if (like) {
        const deleteLike = await Like.findByIdAndDelete(like._id);

        return res
            .status(200)
            .json(new ApiResponse(200, deleteLike, "Unliked the Video"));
    }

    const VideoLiked = await Like.create({
        videoId: videoId,
        likedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, VideoLiked, "Liked the Video"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(404, "Invalid commentId");
    }

    const like = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    if (like) {
        const deleteLike = await Like.findByIdAndDelete(like._id);

        return res
            .status(200)
            .json(new ApiResponse(200, deleteLike, "Unliked the Comment"));
    }

    const CommentLiked = await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, CommentLiked, "Liked the Comment"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid tweetId");
    }

    const like = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    if (like) {
        const deleteLike = await Like.findByIdAndDelete(like._id);

        return res
            .status(200)
            .json(new ApiResponse(200, deleteLike, "Unliked the Tweet"));
    }

    const CommentLiked = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, CommentLiked, "Liked the Tweet"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
