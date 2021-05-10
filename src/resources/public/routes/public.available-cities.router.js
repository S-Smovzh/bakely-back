import { createRequire } from 'module';
import * as availableCitiesController from '../controllers/public.available-cities.controller.js';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  availableCitiesController.default.getAll(req, res);
});

export default router;
