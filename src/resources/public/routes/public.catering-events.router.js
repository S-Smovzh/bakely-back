import { createRequire } from 'module';
import * as cateringController from '../controllers/public.catering-event.controller';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  cateringController.default.getAll(req, res);
});

router.get('/id/:id', function (req, res) {
  cateringController.default.getOne(req, res);
});

router.get('/type/:type', function (req, res) {
  cateringController.default.getByType(req, res);
});

router.get('/keyword/:keyword', function (req, res) {
  cateringController.default.search(req, res);
});

router.get('/feedback/:id', function (req, res) {
  cateringController.default.getFeedbacksForOneEvent(req, res);
});

export default router;
