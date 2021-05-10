import * as productsService from '../service/ProductsService';

const getAll = async function (req, res) {
  const { data, success, errors } = await productsService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getOne = async function (req, res) {
  const { data, success, errors } = await productsService.default.getOne(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const search = async function (req, res) {
  const { data, success, errors } = await productsService.default.search(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getCategories = async function (req, res) {
  const { data, success, errors } = await productsService.default.getCategories(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getAllByType = async function (req, res) {
  const { data, success, errors } = await productsService.default.getAllByType(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getRandomFour = async function (req, res) {
  const { data, success, errors } = await productsService.default.getRandomFour(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

export default {
  getAll,
  getOne,
  search,
  getCategories,
  getAllByType,
  getRandomFour
};
