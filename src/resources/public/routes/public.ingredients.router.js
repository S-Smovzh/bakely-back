import * as ingredientsController from '../controllers/public.ingredients.controller.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  ingredientsController.default.getAll(req, res);
});

router.get('/id/:id', function (req, res) {
  ingredientsController.default.getIngredientsForOneProduct(req, res);
});

router.get('/keyword/:keyword', function (req, res) {
  ingredientsController.default.search(req, res);
});

export default router;
