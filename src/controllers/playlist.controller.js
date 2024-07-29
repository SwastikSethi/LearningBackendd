import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    //TODO: create playlist
    if (!name) {
        throw new ApiError(400, "Playlist name is missing");
    }

    const createPlaylist = await Playlist.create({
        name: name,
        description: description || "New Playlist",
        owner: req.user?._id,
    });

    if (!createPlaylist) {
        throw new ApiError(
            500,
            "Something went wrong while creating new Playlist"
        );
    }

    return res
        .staus(200)
        .json(
            new ApiResponse(
                200,
                createPlaylist,
                "Playlist Created successfully"
            )
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlists,
                "User playlists fetched successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist id is invalid");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) throw new ApiError(404, "Playlist not found");

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist id is invalid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Video id is invalid");
    }

    const playlist = await Playlist.findById(playlistId);

    if (playlist?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "only owner can add video to playlist");
    }

    const addVideo = await Playlist.updateOne(
        { _id: playlistId },
        { $push: { videos: videoId } }
    );

    if (!addVideo) {
        throw new ApiError(
            500,
            "Something went wrong while adding video to playlist"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addVideo,
                "Video Added to playlist Successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist id is invalid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Video id is invalid");
    }

    const playlist = await Playlist.findById(playlistId);

    if (playlist?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete playlist");
    }

    const removeVideo = await Playlist.updateOne(
        { _id: playlistId },
        { $pull: { videos: videoId } }
    );

    if (!removeVideo) {
        throw new ApiError(
            500,
            "Something went wrong while removing video from playlist"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                removeVideo,
                "Video removed from playlist Successfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist id is invalid");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist)
        throw new ApiError(500, "Something went while deleting the playlist");

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Playlist id is invalid");
    }

    const playlist = await Playlist.findById(playlistId);

    if (playlist?.owner.toString() != req.user?._id.toString()) {
        throw new ApiError(400, "only owner can update playlist");
    }

    const Oldname = playlist.name;
    const Olddescription = playlist.description;
    if (!name && !description) {
        throw new ApiError(404, "Both fields can't be empty");
    }
    if (!name) {
        name = Oldname;
    }
    if (!description) {
        description = Olddescription;
    }

    const updatedplaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name,
            description,
        },
    });

    if (!updatedplaylist) {
        throw new ApiError(
            500,
            "Something went wrong while updating playlist details"
        );
    }

    return res
        .status(200)
        .json(200, updatedplaylist, "Playlist updated Successfully");
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
