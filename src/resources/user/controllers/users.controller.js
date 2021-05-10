import * as tokenService from '../../../security/jwt/TokenService.js';
import * as userOrdersService from '../service/UsersOrderService.js';
import * as userCartService from '../service/UsersCartService.js';
import * as userService from '../service/UsersService.js';
import logError from '../service/LogService.js';

const errorHandler = async function (req, res) {
  try {
    const { success, errors } = await logError(req);
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


const register = async function (req, res) {
  try {
    const { success, errors } = await userService.default.register(req);
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

const validateEmailAddress = async function (req, res) {
  try {
    const { success, errors } = await userService.default.validateEmailAddress(req);
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

const login = async function (req, res) {
  try {
    const { body, success, errors } = await userService.default.login(req, res);
    if (success) {
      return res.status(200).json({ success: success, body });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const changePassword = async function (req, res) {
  try {
    const { success, errors } = await userService.default.changePassword(req);
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

const changeEmail = async function (req, res) {
  try {
    const { success, errors } = await userService.default.changeEmail(req);
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

const changeTelNum = async function (req, res) {
  try {
    const { success, errors } = await userService.default.changeTelNum(req);
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
    const { success, errors } = await userService.default.addDeliveryAddress(req);
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

const getAllDeliveryAddresses = async function (req, res) {
  try {
    const { data, success, errors } = await userService.default.getAllDeliveryAddresses(req);
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

const getTheLatestDeliveryAddress = async function (req, res) {
  try {
    const { data, success, errors } = await userService.default.getTheLatestDeliveryAddress(req);
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

const changeDeliveryAddress = async function (req, res) {
  try {
    const { success, errors } = await userService.default.changeDeliveryAddress(req);
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

const deleteDeliveryAddress = async function (req, res) {
  try {
    const { success, errors } = await userService.default.deleteDeliveryAddress(req);
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

const refreshSession = async function (req, res) {
  try {
    const { body, success, errors } = await tokenService.default.refreshSession(req, res);
    if (success) {
      return res.status(200).json({ success: success, body });
    } else if (!success) {
      return res.status(200).json({ success: success, errors: errors });
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const logout = async function (req, res) {
  try {
    const { success } = await tokenService.default.logout(req);
    if (success) {
      return res.status(200).json({ success: success });
    } else if (!success) {
      return res.status(200).json({ success: success});
    }
  } catch (e) {
    console.log('InternalFailure\n\n' + e.stack);
    return res.status(500).json({ success: false, errors: 'InternalFailure!' });
  }
};

const addToCart = async function (req, res) {
  try {
    const { success, errors } = await userCartService.default.addToCart(req);
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
    const { success, errors } = await userCartService.default.removeFromCart(req);
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
    const { data, success, errors } = await userCartService.default.getAllCartItems(req);
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
    const { success, errors } = await userOrdersService.default.proceedOrder(req);
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

const getAllOrders = async function (req, res) {
  try {
    const { data, success, errors } = await userOrdersService.default.getAllOrders(req);
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

const getAllNonDeliveredOrders = async function (req, res) {
  try {
    const { data, success, errors } = await userOrdersService.default.getAllNonDeliveredOrders(req);
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

const searchOrders = async function (req, res) {
  try {
    const { data, success, errors } = await userOrdersService.default.searchOrders(req);
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

const contactForm = async function (req, res) {
  try {
    const { success, errors } = await userService.default.contactForm(req, res);
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
  errorHandler,
  register,
  validateEmailAddress,
  login,
  changePassword,
  changeEmail,
  changeTelNum,
  addDeliveryAddress,
  getAllDeliveryAddresses,
  getTheLatestDeliveryAddress,
  changeDeliveryAddress,
  deleteDeliveryAddress,
  refreshSession,
  logout,
  addToCart,
  getAllCartItems,
  removeFromCart,
  proceedOrder,
  getAllOrders,
  getAllNonDeliveredOrders,
  searchOrders,
  contactForm
};
