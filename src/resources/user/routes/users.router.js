import {createRequire} from 'module';
import * as userController from '../controllers/users.controller.js';
import * as token from '../../../security/jwt/TokenService.js';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({mergeParams: true});

router.post('/error', function (req, res) {
  userController.default.errorHandler(req, res);
});

router.post('/register', function (req, res) {
  userController.default.register(req, res);
});

router.post('/validate', function (req, res) {
  userController.default.validateEmailAddress(req, res);
});

router.post('/login', function (req, res) {
  userController.default.login(req, res);
});

router.post('/change-password', token.default.verifyToken, function (req, res) {
  userController.default.changePassword(req, res);
});

router.post('/change-email', token.default.verifyToken, function (req, res) {
  userController.default.changeEmail(req, res);
});

router.post('/change-tel-num', token.default.verifyToken, function (req, res) {
  userController.default.changeTelNum(req, res);
});

router.post('/addresses/add', token.default.verifyToken, function (req, res) {
  userController.default.addDeliveryAddress(req, res);
});

router.get('/addresses/all', token.default.verifyToken, function (req, res) {
  userController.default.getAllDeliveryAddresses(req, res);
});

router.get('/addresses/latest', token.default.verifyToken, function (req, res) {
  userController.default.getTheLatestDeliveryAddress(req, res);
});

router.post('/addresses/change', token.default.verifyToken, function (req, res) {
  userController.default.changeDeliveryAddress(req, res);
});

router.delete('/addresses/delete/:id', token.default.verifyToken, function (req, res) {
  userController.default.deleteDeliveryAddress(req, res);
});

router.post('/refresh', token.default.verifyToken, function (req, res) {
  userController.default.refreshSession(req, res);
});

router.post('/logout', token.default.verifyToken, function (req, res) {
  userController.default.logout(req, res);
});

router.post('/cart/add', token.default.verifyToken, function (req, res) {
  userController.default.addToCart(req, res);
});

router.delete('/cart/remove', token.default.verifyToken, function (req, res) {
  userController.default.removeFromCart(req, res);
});

router.get('/:lang/cart/all', token.default.verifyToken, function (req, res) {
  userController.default.getAllCartItems(req, res);
});

router.post('/order/proceed', token.default.verifyToken, function (req, res) {
  userController.default.proceedOrder(req, res);
});

router.get('/:lang/order/all', token.default.verifyToken, function (req, res) {
  userController.default.getAllOrders(req, res);
});

router.get('/:lang/order/active', token.default.verifyToken, function (req, res) {
  userController.default.getAllNonDeliveredOrders(req, res);
});

router.get('/order/keyword/:keyword', token.default.verifyToken, function (req, res) {
  userController.default.searchOrders(req, res);
});

router.post('/contact', token.default.verifyClientsToken, function (req, res) {
  userController.default.contactForm(req, res);
});

export default router;
