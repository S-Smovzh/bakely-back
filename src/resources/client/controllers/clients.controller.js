import * as clientsOrdersService from '../service/ClientsOrderService.js';
import * as clientsCartService from '../service/ClientsCartService.js';
import * as clientsService from '../service/ClientsService.js';

const createSession = async function (req, res) {
  try {
    return await clientsService.default.createSession(req, res);
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const addSubscription = async function (req, res) {
  try {
    const { success, errors } = await clientsService.default.addSubscription(req, res);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const contactForm = async function (req, res) {
  try {
    const { success, errors } = await clientsService.default.contactForm(req, res);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const addDeliveryAddress = async function (req, res) {
  try {
    const { success, errors } = await clientsService.default.addDeliveryAddress(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const addContactData = async function (req, res) {
  try {
    const { success, errors } = await clientsService.default.addContactData(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const addToCart = async function (req, res) {
  try {
    const { success, errors } = await clientsCartService.default.addToCart(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const removeFromCart = async function (req, res) {
  try {
    const { success, errors } = await clientsCartService.default.removeFromCart(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const getAllCartItems = async function (req, res) {
  try {
    const { data, success, errors } = await clientsCartService.default.getAllCartItems(req);
    if (success) {
      return res.status(200).json({ success: success, data: data });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const proceedOrder = async function (req, res) {
  try {
    const { success, errors } = await clientsOrdersService.default.proceedOrder(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};


export default {
  createSession,
  addDeliveryAddress,
  addContactData,
  addToCart,
  removeFromCart,
  getAllCartItems,
  proceedOrder,
  addSubscription,
  contactForm
};
