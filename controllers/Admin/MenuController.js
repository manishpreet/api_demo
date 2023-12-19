const DISH = require('../../models/DishModel');
const MENU = require('../../models/menuModel');
const { header, body, query, validationResult } = require('express-validator');
const helper = require('../../helpers/api-response');


exports.addDish = [
    body('name').trim().exists().notEmpty().withMessage('Dish name is required'),
    body('price').trim().exists().notEmpty().withMessage('Dish price is required'),
    body('dishType').trim().exists().notEmpty().withMessage('Dish type is required'),
    body('quantity').trim().exists().notEmpty().withMessage('Dish quantity is required'),
    async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { name, price, dishType, quantity } = req.body;
                const refData = {
                    name: name,
                    price: price,
                    dishType: dishType,
                    quantity: quantity,
                };

                const createDish = await DISH.create(refData);
                if (createDish) {
                    return helper.successResponse(res, 'Dish Added Successfully');
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


exports.getDishData = async (req, res) => {
    try {
        const findDish = await DISH.find({});
        return helper.successResponseWithData(res, 'Dish details fetched', findDish);
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
    }
};


exports.deleteDish = [
    query('dishId').trim().exists().notEmpty().withMessage('Dish name is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            const { dishId } = req.query;
            await DISH.deleteOne({ _id: dishId });
            return helper.successResponse(res, 'Dish deleted successfully');
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];


exports.addMenu = [
    body('dayName').trim().exists().notEmpty().withMessage('Day Name is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {

                const { dayName, dishes } = req.body;

                // if (dishes.length == 0) {
                //     return helper.validationError(res, 'Dishes array is empty');
                // }

                const refData = {
                    dayName: dayName,
                    dishes: dishes
                };

                const createMenu = await MENU.create(refData);
                if (createMenu) {
                    return helper.successResponse(res, 'Menu Added Successfully');
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


exports.getMenu = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const menus = await MENU.find({}).populate('dishes');
                return helper.successResponseWithData(res, 'Menu fetched Successfully', menus);
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];


exports.updateMenu = [
    body('id').trim().exists().notEmpty().withMessage('Menu id is required'),
    body('dishes').trim().exists().notEmpty().withMessage('Dishes are required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return helper.validationError(res, errors.array()[0]['msg']);
            }
            else {
                const { id, dishes } = req.body;
                var query = { _id: id };
                var valuesToUpdate = { $set: { dishes: dishes } };

                MENU.updateOne(query, valuesToUpdate, function (err, updateRes) {
                    if (err) { throw err; }
                    else if (updateRes) {
                        return helper.successResponseWithData(res, 'Menu Updated Successfully');
                    }
                });
            }
        }
        catch (err) {
            console.log('catched errorrrrrrrrrrrrr', err);
            return helper.catchedErrorResponse(res, 'Internal Server Error!!!');
        }
    }];
