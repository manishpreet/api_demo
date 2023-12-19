const USER = require('../../models/UserModel');
const { body, query, validationResult } = require('express-validator');
const helper = require('../../helpers/api-response');
const JWT = require('jsonwebtoken');
const { name } = require('pug');


exports.login = [
    body('dialCode').trim().exists().notEmpty().withMessage('Dial Code is required'),
    body('phone').trim().exists().notEmpty().withMessage('Phone Number is required')
        .isLength({ min: 10 }).withMessage('Please provide a valid Phone Number'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { dialCode, phone } = req.body;
                const checkPhoneExist = await USER.findOne({ phone: phone });
                if (!checkPhoneExist) {
                    const refData = {
                        dialCode: dialCode,
                        phone: phone
                    };
                    const createUser = await USER.create(refData);
                    if (createUser) {
                        await USER.updateOne({ _id: createUser._id }, { otp: 123456, phoneVerified: false });
                        return helper.successResponse(res, 'An OTP has been sent to your registered Phone');
                    }
                    else {
                        return helper.errorResponse(res, 'Something went wrong!');
                    }
                }
                else {
                    await USER.updateOne({ _id: checkPhoneExist._id }, { otp: 123456, phoneVerified: false });
                    return helper.successResponse(res, 'An OTP has been sent to your registered Phone');
                }
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];


exports.getUserData = async (req, res) => {
    try {
        const findUser = await USER.findOne({ _id: req.currentUser._id }).lean();
        if (findUser) {
            return helper.successResponseWithData(res, 'User details fetched', findUser);
        }
        else {
            return helper.errorResponse(res, 'User with this phone does not exist');
        }
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
};


exports.verifyOtp = [
    body('phone').trim().exists().notEmpty().withMessage('Phone is required'),
    body('otp').trim().exists().isLength({ min: 6 }).withMessage('OTP is required')
        .isLength({ min: 6 }).withMessage('OTP must be 6 in length or above'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { phone,otp } = req.body;
                const finduser = await USER.findOne({ phone: phone }).lean();
                if (finduser) {
                    if (finduser.otp === otp){
                        const tokenSigned = JWT.sign({ _id: finduser._id }, process.env.JWT_PRIVATE_KEY);
                        var query = { _id: finduser._id };
                        var valuesToUpdate = { $set: {token:tokenSigned , phoneVerified: true} };
                        USER.updateMany(query, valuesToUpdate, function (err, updateRes) {
                            if (err) { throw err; }
                            else if (updateRes) {
                                 USER.findOne({ phone: phone },function(err, user) {
                                    if (err) { throw err; }
                                    else if (user) {
                                        return helper.successResponseWithData(res, 'User Verified Successfully',user);
                                    }else{
                                        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
                                    }
                                    });
                            }else{
                                return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
                            }
                        });
                    
                    }
                    else {
                        return helper.errorResponse(res, 'Incorrect OTP has been entered');
                    }
                }
                else {
                    return helper.errorResponse(res, 'User with this email does not exist');
                }
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];

   
    exports.updateUser = [
        body('name').trim().exists().notEmpty().withMessage('Name is required'),
        body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return helper.validationError(res, errors.array()[0]['msg']);
                }
                const {name,email} = req.body;
            var query = { _id: req.currentUser._id };
                        var valuesToUpdate = { $set: {name:name , email: email} };
                        USER.updateMany(query, valuesToUpdate, function (err, updateRes) {
                            if (err) { throw err; }
                            else if (updateRes) {
                                 USER.findOne({ phone: req.currentUser.phone },function(err, user) {
                                    if (err) { throw err; }
                                    else if (user) {
                                        return helper.successResponseWithData(res, 'User Updated Successfully',user);
                                    }else{
                                        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
                                    }
                                    });
                            }else{
                                return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
                            }
                        });
            }
            catch (err) {
                console.log('catched errorrrrrrrrrrrrr', err);
                return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
            }
        }];
    