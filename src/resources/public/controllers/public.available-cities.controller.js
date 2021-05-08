import * as availableCitiesService from '../service/availableCitiesService.js';

const getAll = async function (req, res) {
  const { data, success, errors } = await availableCitiesService.default.getAll(req);
  if (success) {
    return res.status(200).json({ success: success, data: data });
  } else if (!success) {
    return res.status(200).json({ success: success, errors: errors });
  } else {
    return res.status(500).json({ success: success, errors: 'InternalFailure!' });
  }
};

export default {
  getAll
};
