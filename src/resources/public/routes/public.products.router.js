import * as productsController from '../controllers/public.products.controller.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  productsController.default.getAll(req, res);
});

router.get('/id/:id', function (req, res) {
  productsController.default.getOne(req, res);
});

router.get('/keyword/:keyword', function (req, res) {
  productsController.default.search(req, res);
});

router.get('/similar/:type/:id', function (req, res) {
  productsController.default.getRandomFour(req, res);
});

router.get('/categories', function (req, res) {
  productsController.default.getCategories(req, res);
});

router.get('/type/:type/all', function (req, res) {
  productsController.default.getAllByType(req, res);
});

export default router;
