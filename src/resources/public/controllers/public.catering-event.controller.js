import * as cateringService from '../service/CateringsService.js';

const getAll = async function (req, res) {
  const { data, success, errors } = await cateringService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getOne = async function (req, res) {
  const { data, success, errors } = await cateringService.default.getOne(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getByType = async function (req, res) {
  const { data, success, errors } = await cateringService.default.getByType(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const search = async function (req, res) {
  const { data, success, errors } = await cateringService.default.search(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getFeedbacksForOneEvent = async function (req, res) {
  const { data, success, errors } = await cateringService.default.getFeedbacksForOneEvent(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

export default {
  getOne,
  getAll,
  getByType,
  search,
  getFeedbacksForOneEvent
};
