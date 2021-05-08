import * as clientsController from '../controllers/clients.controller.js';
import {createRequire} from 'module';
import * as token from '../../../security/jwt/TokenService.js';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({mergeParams: true});

router.get('/create-session', function (req, res) {
  clientsController.default.createSession(req, res);
});

router.post('/add-delivery-address', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.addDeliveryAddress(req, res);
});

router.post('/add-contact-data', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.addContactData(req, res);
});

router.post('/cart/add', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.addToCart(req, res);
});

router.delete('/cart/remove', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.removeFromCart(req, res);
});

router.get('/:lang/cart/all', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.getAllCartItems(req, res);
});

router.post('/order/proceed', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.proceedOrder(req, res);
});

router.post('/subscribe', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.addSubscription(req, res);
});

router.post('/contact', token.default.verifyClientsToken, function (req, res) {
  clientsController.default.contactForm(req, res);
});

export default router;
