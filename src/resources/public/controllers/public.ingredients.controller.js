import * as ingredientsService from '../service/IngredientsService.js';

const getAll = async function (req, res) {
  const { data, success, errors } = await ingredientsService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const getIngredientsForOneProduct = async function (req, res) {
  const { data, success, errors } = await ingredientsService.default.getIngredientsForOneProduct(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

const search = async function (req, res) {
  const { data, success, errors } = await ingredientsService.default.search(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

export default {
  getIngredientsForOneProduct,
  getAll,
  search
};
