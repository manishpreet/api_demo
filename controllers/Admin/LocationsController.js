const { header, body, query, validationResult } = require('express-validator');
const helper = require('../../helpers/api-response');
const LOCATION = require('../../models/LocationModel');




exports.addLocation = [
    body('name').trim().exists().notEmpty().withMessage('Location Name is required'),
    body('pincode').trim().exists().notEmpty().withMessage('Pincode is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {

                const { name, pincode } = req.body;

                const refData = {
                    name: name,
                    pincode: pincode
                };

                const added = await LOCATION.create(refData);
                if (added) {
                    return helper.successResponse(res, 'Location Added Successfully');
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


    exports.getLocations = async (req, res) => {
        try {
            const locations = await LOCATION.find({});
            return helper.successResponseWithData(res, 'Locations Fetched Successfully', locations);
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    };


    exports.deleteLocation = [
        body('id').trim().exists().notEmpty().withMessage('Location id is required'),
        async (req, res) => {
        try {
            const { id } = req.query;
            var query = { _id: id };
            const locations = await LOCATION.deleteOne(query);
            return helper.successResponseWithData(res, 'Locations Deleted Successfully');
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];

    
    