const JWT = require('jsonwebtoken');
const helper = require('../helpers/api-response');
const USER = require('../models/UserModel');


const validateUser = async (req, res, next) => {
    try {
        if(req.headers.authorization == null || req.headers.authorization == undefined) {
            return helper.errorResponse(res, 'No token found for this user');
        }

        let token = req.headers.authorization.split(' ')[1];
        if (!token) return helper.errorResponse(res, 'Something wrong with Token');
        let decodeToken = JWT.verify(token, process.env.JWT_PRIVATE_KEY);
        const userData = await USER.findOne({ _id: decodeToken._id });
        if (!userData) return helper.unAuthorizedResponse(res, 'Un-authorized user !!!');
        req.currentUser = userData;
        next();
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
}

module.exports = { validateUser };