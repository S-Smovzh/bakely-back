import * as bakeriesService from '../service/BakeriesService.js';
import * as bakeriesProductsService from '../service/BakeriesProductsService.js';

const getAll = async function (req, res) {
  const { data, success, errors } = await bakeriesService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getOne = async function (req, res) {
  const { data, success, errors } = await bakeriesService.default.getOne(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const search = async function (req, res) {
  const { data, success, errors } = await bakeriesService.default.search(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getStockOfProduct = async function (req, res) {
  const { data, success, errors } = await bakeriesProductsService.default.getStockOfProduct(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const decreaseQuantity = async function (req, res) {
  const { success, errors } = await bakeriesProductsService.default.decreaseQuantity(req);
  if (success) {
    return res.status(200).json({ success: success });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

export default {
  getOne,
  getAll,
  search,
  getStockOfProduct,
  decreaseQuantity
};
