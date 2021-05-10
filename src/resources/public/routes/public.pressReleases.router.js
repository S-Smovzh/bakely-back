import { createRequire } from 'module';
import * as pressReleasesController from '../controllers/public.pressReleases.controller.js';

const require = createRequire(import.meta.url);
const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/all', function (req, res) {
  pressReleasesController.default.getAll(req, res);
});

router.get('/id/:id', function (req, res) {
  pressReleasesController.default.getOne(req, res);
});

router.get('/keyword/:keyword', function (req, res) {
  pressReleasesController.default.search(req, res);
});

export default router;
