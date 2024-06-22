import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const content = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    if (!content) {
        throw new ApiError(400, "Comment cannot empty");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id,
    });

    if (!newComment) {
        throw new ApiError(500, "Something went wrong while adding comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const commentId = req.params;
    const content = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid coment Id");
    }

    if (!content) {
        throw new ApiError(400, "Comment cannot empty");
    }

    const oldComment = await Comment.findById(commentId);

    if (!oldComment) {
        throw new ApiError(400, "Comment not found");
    }

    if (oldComment?.owner.toString() !== req.user?._id) {
        throw new ApiError(400, "Only owner can edit comment");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
            },
        },
        { new: true }
    );

    // oldComment.content = req.body.content;
    // await oldComment.save();

    if (!comment) {
        throw new ApiError(500, "Something went wrong while updating comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const commentId = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid coment Id");
    }

    const oldComment = await Comment.findById(commentId);

    if (oldComment?.owner.toString() !== req.user?._id) {
        throw new ApiError(400, "Only owner can edit comment");
    }

    const deleteComment = await Comment.deleteOne({ _id: commentId });

    if (deleteComment.deletedCount === 0) {
        throw new ApiError(500, "Something went wrong while deleting comment");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deleteComment, "Comment deleted successfully")
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };
