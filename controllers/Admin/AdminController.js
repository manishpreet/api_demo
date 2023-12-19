const ADMIN = require('../../models/AdminModel');
const { body, query, validationResult } = require('express-validator');
const helper = require('../../helpers/api-response');
const bcrypt = require('bcrypt');
const salt = 10;
const JWT = require('jsonwebtoken');


exports.register = [
    body('name').trim().exists().notEmpty().withMessage('Name is required'),
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in length or above'),

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { name, password } = req.body;

                const email = req.body.email.toLowerCase();

                const checkEmailExist = await ADMIN.findOne({ email: email });
                if (checkEmailExist) {
                    return helper.errorResponseWithData(res, 'Email is already exist', checkEmailExist.email);
                }

                const refData = {
                    name: name,
                    email: email,
                    password: await bcrypt.hash(password, salt),
                };

                const createAdmin = await ADMIN.create(refData);
                if (createAdmin) {
                    const tokenSigned = JWT.sign({ _id: createAdmin._id }, process.env.JWT_SECRET);
                    return helper.successResponseWithDataAndToken(res, 'Admin registered successfully', createAdmin, tokenSigned);
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


exports.login = [
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().isLength({ min: 6 }).withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in length or above'),

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { password } = req.body;

                const email = req.body.email.toLowerCase();

                const findAdmin = await ADMIN.findOne({ email: email }).lean();
                if (findAdmin) {
                    if (findAdmin.emailVerificationStatus === false) {
                        return helper.errorResponse(res, 'Your Account is not verified yet, please contact to Admin');
                    }

                    const verifyPassword = await bcrypt.compare(password, findAdmin.password);
                    if (verifyPassword) {
                        const tokenSigned = JWT.sign({ _id: findAdmin._id }, process.env.JWT_PRIVATE_KEY);
                        delete findAdmin.password;
                        findAdmin.token = tokenSigned;
                        return helper.successResponseWithData(res, 'Login successfully', findAdmin);
                    }
                    else {
                        return helper.errorResponse(res, 'Incorrect password has been entered');
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


exports.forgotPassword = [
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const email = req.body.email.toLowerCase();

                const findAdmin = await ADMIN.findOne({ email: email });
                if (findAdmin) {
                    helper.successResponse(res, 'An OTP has been sent to your registered email');
                    //const otp = Math.floor(100000 + Math.random() * 900000);
                    const otp = 123456;
                    await ADMIN.updateOne({ _id: findAdmin._id }, { $set: { otp: otp } });
                    //await sendgridMailer.forgotPassword(email, tempPassword, findStudent.name);  //calling sendgridMailer
                    return;
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


exports.updatePassword = [
    body('otp').trim().exists().notEmpty().withMessage('Otp is required'),
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),
    body('newPassword').trim().exists().notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in length or above'),

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {

                const { otp, newPassword } = req.body;

                const email = req.body.email.toLowerCase();

                const findAdmin = await ADMIN.findOne({ email: email });
                if (findAdmin) {
                    if (findAdmin.otp === otp) {
                        return helper.errorResponse(res, 'Incorrect Otp!');
                    }

                    const hashed = await bcrypt.hash(newPassword, salt);
                    await ADMIN.updateOne({ _id: findAdmin._id }, { $set: { password: hashed } });

                    return helper.successResponse(res, 'Password changed successfully');
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

exports.getAllUsers = [
    body('otp').trim().exists().notEmpty().withMessage('Otp is required'),
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isLength({ min: 3 }).withMessage('Email must be 3 in length or above')
        .isEmail().withMessage('Email must be a valid email address'),
    body('newPassword').trim().exists().notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in length or above'),

    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {

                const { otp, newPassword } = req.body;

                const email = req.body.email.toLowerCase();

                const findAdmin = await ADMIN.findOne({ email: email });
                if (findAdmin) {
                    if (findAdmin.otp === otp) {
                        log.console(otp);
                        return helper.errorResponse(res, 'Incorrect Otp!');
                    }

                    const hashed = await bcrypt.hash(newPassword, salt);
                    await ADMIN.updateOne({ _id: findAdmin._id }, { $set: { password: hashed } });

                    return helper.successResponse(res, 'Password changed successfully');
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


exports.getAdminData = async (req, res) => {
    try {
        const findAdmin = await ADMIN.findOne({ _id: req.currentAdmin._id }).lean();
        if (findAdmin) {
            delete findAdmin.password;
            return helper.successResponseWithData(res, 'Admin details fetched', findAdmin);
        }
        else {
            return helper.errorResponse(res, 'User with this email does not exist');
        }
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
};


exports.editAdmin = async (req, res) => {
    try {

        let arrayOfKeysForStudent = ['name', 'mobile', 'alternateMobile', 'gender', 'dob', 'profilePicture'];

        const updateRecordsForStudent = {};
        for (const key of arrayOfKeysForStudent) {
            if (req.body[key] != null) {
                updateRecordsForStudent[key] = req.body[key]
            }
        }

        const findStudent = await STUDENT.findOneAndUpdate({ _id: req.currentStudent._id }, { $set: updateRecordsForStudent }, { new: true });
        if (findStudent) {
            return helper.successResponseWithData(res, 'Student details has updated successfully', findStudent);
        }
        else {
            return helper.errorResponse(res, 'Student does not exist');
        }
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
};