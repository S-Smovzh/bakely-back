import * as pressReleasesService from '../service/PressReleasesService.js';

const getAll = async function (req, res) {
  const { data, success, errors } = await pressReleasesService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getOne = async function (req, res) {
  const { data, success, errors } = await pressReleasesService.default.getOne(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const search = async function (req, res) {
  const { data, success, errors } = await pressReleasesService.default.search(req);
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
  search
};
