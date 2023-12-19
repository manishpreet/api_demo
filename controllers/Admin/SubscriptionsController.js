const { header, body, query, validationResult } = require('express-validator');
const helper = require('../../helpers/api-response');
const SUBSCRIPTION = require('../../models/SubscriptionsModel');




exports.addSubscription = [
    body('day').trim().exists().notEmpty().withMessage('Day is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {

                const { day, tiffins } = req.body;

                const refData = {
                    day: day,
                    tiffins: tiffins
                };
                const added = await SUBSCRIPTION.create(refData);
                if (added) {
                    return helper.successResponse(res, 'Subscription Added Successfully');
                }
                else {
                    return helper.errorResponse(res, 'Something went wrong!');
                }
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];


exports.getSubscriptions = async (req, res) => {
    try {
        const locations = await SUBSCRIPTION.find({});
        return helper.successResponseWithData(res, 'Subscriptions Fetched Successfully', locations);
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
};


exports.updateSubscription = [
    body('subsId').trim().exists().notEmpty().withMessage('Subscription Id is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { subsId, tiffins } = req.body;

                if (tiffins.length == 0) {
                    return helper.validationError(res, 'Tiffin array is empty');
                }

                const findSubs = await SUBSCRIPTION.findById({ _id: subsId });
                if (!findSubs) {
                    return helper.errorResponse(res, 'Subscription not found');
                }
                const data = await SUBSCRIPTION.findOneAndUpdate({ _id: subsId }, { tiffins: tiffins }, { new: true });
                return helper.successResponseWithData(res, 'Updated Successfully', data);
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];



