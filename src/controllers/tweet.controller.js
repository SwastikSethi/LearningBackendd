import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body;

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while tweeting");
    }

    return res.status(200).json(200, tweet, "Tweet posted Successfully");
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid Tweet id");
    }

    const tweet = await Tweet.findById(tweetId);
    // console.log(tweet);
    if (!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    if (tweet?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can edit tweet");
    }

    const { content } = req.body;

    if (!content) {
        throw new ApiError(405, "Tweet Cannot be Empty");
    }

    const UpdateTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            content,
        },
    });

    if (!updateTweet) {
        throw new ApiError(500, "Something went wrong while updating Tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateTweet, "Tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid Tweet id");
    }

    const tweet = await Tweet.findById(tweetId);
    // console.log(tweet);
    if (!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    if (tweet?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can delete tweet");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deleteTweet) {
        throw new ApiError(500, "Something went wrong while deleting Tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteTweet, "Tweet Updated Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
