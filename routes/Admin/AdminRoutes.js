const express = require('express');
const router = express.Router();
const { validateAdmin } = require('../../middleware/adminAuth');
const adminController = require('../../controllers/Admin/AdminController');
const menuController = require('../../controllers/Admin/MenuController');
const locationController = require('../../controllers/Admin/LocationsController');
const subscriptionsController = require('../../controllers/Admin/SubscriptionsController');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/forgotPassword', adminController.forgotPassword);
router.post('/updatePassword', adminController.updatePassword);
router.get('/getAdminData', validateAdmin, adminController.getAdminData);

/********************DISH**********************/
router.post('/addDish', validateAdmin, menuController.addDish);
router.get('/getDishData', validateAdmin, menuController.getDishData);
router.delete('/deleteDish', validateAdmin, menuController.deleteDish);


/********************Menu**********************/
router.get('/getMenu', validateAdmin, menuController.getMenu);
router.post('/addMenu', validateAdmin, menuController.addMenu);
router.post('/updateMenu', validateAdmin, menuController.updateMenu);


/********************Locations**********************/
router.post('/addLocation', validateAdmin, locationController.addLocation);
router.get('/getLocations', validateAdmin, locationController.getLocations);
router.delete('/deleteLocation', validateAdmin, locationController.deleteLocation);

/********************Subscriptions**********************/
router.post('/addSubscription', validateAdmin, subscriptionsController.addSubscription);
router.get('/getSubscriptions', validateAdmin, subscriptionsController.getSubscriptions);
router.put('/updateSubscription', validateAdmin, subscriptionsController.updateSubscription);


module.exports = router;
