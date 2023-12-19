var express = require('express');
var router = express.Router()
const { validateUser } = require('../../middleware/userAuth');
const UserController = require('../../controllers/User/UserController');
const AuthController = require('../../controllers/User/AuthController');


//---------------------------------------------Transactions Controller---------------------------------------------------------------------------------

router.post('/create-paymenlink', UserController.createPaymentLink);
router.put('/create-paymenlinnk', UserController.restartWebhook);
router.post('/create-subscriptions-webhook', UserController.createSubscriptionWebhook);
router.post('/cancel-subscription', UserController.cancelSuscription);
router.get('/get-subscription-details', UserController.getSuscription);
router.post('/subscription-update-webhook', UserController.subscriptionUpdate);

router.get('/payment-success-page', UserController.paymentSuccessPage);
router.get('/payment-failed-page', UserController.paymentFaildPage);

router.post('/stripe-weebhook', UserController.stripeWebHook);
router.get('/get-transactions', UserController.getAllTransactions);
router.get('/export-transactions', UserController.exportAllTransactions);


//========================================Test Api================================================================
router.post('/create-paymenlink-test', UserController.createPaymentLinkTest);
router.post('/create-subscriptions-webhook-test', UserController.createSubscriptionWebhookTest);
router.post('/subscription-update-webhook-test', UserController.subscriptionUpdateTest);


// router.post('/invoice_payment_failed',  UserController.invoice_payment_failed);
router.get('/get-auto-payments-status', UserController.getSubAutoRenewalDetails);


/********************Auth**********************/
router.post('/user/login', AuthController.login);
router.get('/user/getUserData',validateUser ,AuthController.getUserData);
router.post('/user/verifyOtp', AuthController.verifyOtp);
router.post('/user/updateUser',validateUser, AuthController.updateUser);



module.exports = router

















