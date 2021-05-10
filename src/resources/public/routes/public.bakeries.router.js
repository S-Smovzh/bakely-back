import { createRequire } from 'module';
import * as bakeriesController from '../controllers/public.bakeries.controller';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  bakeriesController.default.getAll(req, res);
});

router.get('/id/:id', function (req, res) {
  bakeriesController.default.getOne(req, res);
});

router.get('/keyword/:keyword', function (req, res) {
  bakeriesController.default.search(req, res);
});

router.get('/stock', function (req, res) {
  bakeriesController.default.getStockOfProduct(req, res);
});

router.post('/decrease', function (req, res) {
  bakeriesController.default.decreaseQuantity(req, res);
});

export default router;
