import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new ApiError(404, "Invalid channelId");
    }

    const subscribe = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id,
    });

    if (subscribe) {
        const RemoveSubscription = await Subscription.findByIdAndDelete(
            subscribe._id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, RemoveSubscription, "Subscription removed")
            );
    }

    const AddSubscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, AddSubscription, "Subscription Added!!"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
