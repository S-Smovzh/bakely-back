import dotenv from 'dotenv';
import db from '../../config/database.config.js';
import {createRequire} from 'module';
import {errorCodes} from '../../utils/errorCodes.js';
import ms from 'ms';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

dotenv.config({path: './../../.env'});

const MAX_REFRESH_SESSIONS_COUNT = 5;

async function generateJWT(res, userData, requestData) {
  const body = [
    {token: await _generateAccessToken(userData.userId, userData.email, userData.cartId)},
    {refreshToken: await _addRefreshSession(userData, requestData)}
  ];

  return {body: body, success: true, errors: null};
}

async function refreshSession(req, res) {
  let token = req.headers['token'].split('"').join('') || req.cookies.token;
  let reqRefreshToken = req.headers['refresh-token'].split('"').join('') || req.cookies.refreshToken;
  const user = req.user;
  const fingerprint = req.body.fingerprint;

  if (!token || !reqRefreshToken) {
    return {
      success: false,
      errors: {errorCode: errorCodes.REFRESH_TOKEN_NOT_PROVIDED}
    };
  }

  try {
    const rows = await _getRefreshSession(user);
    if (_verifySessionRefreshRequest(rows[0], fingerprint)) {
      const userData = {
        userId: user.userId,
        email: user.email,
        cartId: user.cartId
      };

      const requestData = {
        ip: req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        fingerprint: fingerprint
      };

      return generateJWT(res, userData, requestData);
    } else {
      console.log('Session verification failure in TokenService.refreshSession()');
      return {
        success: false,
        errors: {code: errorCodes.SESSION_EXPIRED}
      };
    }
  } catch (e) {
    console.log('Querying failure in TokenService.refreshSession()\n\n' + e.stack);
    return {success: false, errors: {code: 500}};
  }
}

async function verifyToken(req, res, next) {
  let token = req.headers['token'].split('"').join('') || req.cookies.token;

  if (!token) {
    return res.status(200).json({errors: {code: errorCodes.TOKEN_NOT_PROVIDED}}).end();
  } else {
    try {
      const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decrypt.userId,
        email: decrypt.email,
        cartId: decrypt.cartId
      };
      next();
    } catch (e) {
      console.log(e.stack);
      return res.status(200).json({errors: {code: errorCodes.SESSION_EXPIRED}}).end();
    }
  }
}

async function logout(req, res) {
  const pool = db.pool;
  const user = req.user;
  const sql = 'DELETE FROM refresh_sessions WHERE user_id = $1 AND ip = $2;';

  try {
    await pool.query(sql, [user.userId, req.body.ip]);
    res.status(200).json({success: true}).end();
  } catch (e) {
    console.log('Internal failure in TokenService._wipeAllUserRefreshSessions()  \n\n' + e.stack);
    res.status(200).json({success: false}).end();
  }
}

// refreshSession - data from frontend
async function _addRefreshSession(refreshSessionData, requestData) {
  if (await _isValidSessionsCount(refreshSessionData.userId)) {
    return _addRefreshSessionRecord(refreshSessionData, requestData);
  } else {
    await _wipeAllUserRefreshSessions(refreshSessionData.userId);
    return _addRefreshSessionRecord(refreshSessionData, requestData);
  }
}

// проверка лимита возможных активных сессий
async function _isValidSessionsCount(userId) {
  const pool = db.pool;
  const sql = 'SELECT COUNT(refresh_token) FROM refresh_sessions WHERE user_id = $1;';

  try {
    const {rows} = await pool.query(sql, [userId]);
    return rows[0] < MAX_REFRESH_SESSIONS_COUNT;
  } catch (e) {
    console.log('Internal failure in TokenService._isValidSessionsCount()  \n\n' + e.stack);
  }
}

// создание новой записи с информацией о сессии
async function _addRefreshSessionRecord(refreshSessionData, requestData) {
  const pool = db.pool;
  const refreshToken = await _generateRefreshToken(refreshSessionData.userId);
  const expiresIn = ms(process.env.JWT_REFRESH_EXPIRATION_TIME);
  const sql = 'INSERT INTO refresh_sessions (user_id, refresh_token, user_agent, ip, expires_in, created_at, fingerprint) VALUES ($1, $2, $3, $4, $5, $6, $7);';

  try {
    await pool.query(sql, [refreshSessionData.userId, refreshToken, requestData.userAgent || 'test-agent', requestData.ip || 'test-ip', expiresIn, Date.now(), requestData.fingerprint]);
    return refreshToken;
  } catch (e) {
    console.log('Internal failure in TokenService._addRefreshSession()  \n\n' + e.stack);
    return null;
  }
  // for better performance store refresh sessions in Redis persistence
}

// удаление всех сессий по id пользователя
async function _wipeAllUserRefreshSessions(userId) {
  const pool = db.pool;
  const sql = 'DELETE FROM refresh_sessions WHERE user_id = $1;';

  try {
    await pool.query(sql, [userId]);
    return true;
  } catch (e) {
    console.log('Internal failure in TokenService._wipeAllUserRefreshSessions()  \n\n' + e.stack);
    return false;
  }
}

// проверка подлинности запроса на обновление сессии
// (сравнивает текущий fingerprint/ip с тем, который записан в БД)
function _verifySessionRefreshRequest(oldRefreshSessionData, newFingerprint) {
  const currentTime = Date.now();
  if (currentTime > oldRefreshSessionData.createdAt + oldRefreshSessionData.expiresIn) return new Error(errorCodes.SESSION_EXPIRED.toString());
  if (oldRefreshSessionData.ip !== newFingerprint) return new Error(errorCodes.INVALID_REFRESH_SESSION.toString());
  // if (oldRefreshSessionData.fingerprint !== newFingerprint) return reject(new Error(errorCodes.INVALID_REFRESH_SESSION.toString()));
  return true;
}

function _generateAccessToken(userId, email, cartId) {
  return jwt.sign({userId, email, cartId}, process.env.JWT_SECRET,
    {
      algorithm: 'HS512',
      subject: userId.toString(),
      expiresIn: '15m'
    });
}

function _generateRefreshToken(userId) {
  return jwt.sign({userId}, process.env.JWT_REFRESH_SECRET,
    {
      algorithm: 'HS512',
      subject: userId.toString(),
      expiresIn: '60d'
    });
}

async function _getRefreshSession(user) {
  const pool = db.pool;
  const sql = 'SELECT id, user_id as "userId", refresh_token as "refreshToken", user_agent AS "userAgent", ip, expires_in AS "expiresIn", created_at AS "createdAt", fingerprint FROM refresh_sessions WHERE user_id = $1;';

  try {
    const {rows} = await pool.query(sql, [user.userId]);
    return rows;
  } catch (e) {
    console.log('Internal failure in TokenService.getRefreshSession()  \n\n' + e.stack);
    return null;
  }
}

/////////////----CLIENT----\\\\\\\\\\\\\
function _generateClientsAccessToken(clientId, ip, cartId) {
  return jwt.sign({clientId, ip, cartId}, process.env.CLIENTS_JWT_SECRET,
    {
      algorithm: 'HS512',
      subject: clientId.toString(),
      expiresIn: '60d'
    });
}

async function verifyClientsToken(req, res, next) {
  let token = req.headers['client-token'].split('"').join('') || req.cookies.clientsToken;

  if (!token) {
    return res.status(200).json({errors: {code: errorCodes.TOKEN_NOT_PROVIDED}}).end();
  } else {
    try {
      const decrypt = await jwt.verify(token, process.env.CLIENTS_JWT_SECRET);
      req.client = {
        clientId: decrypt.clientId,
        ip: decrypt.ip,
        cartId: decrypt.cartId
      };
      next();
    } catch (e) {
      console.log(e.stack)
      return res.status(200).json({errors: {code: errorCodes.TOKEN_NOT_PROVIDED}}).end();
    }
  }
}

async function generateClientsJWT(res, data) {
  const body = [
    {token: await _generateClientsAccessToken(data.clientId, data.ip, data.cartId)}
  ];

  return await res.status(200).json({body: body, success: true});
}

export default {
  generateJWT,
  verifyToken,
  refreshSession,
  logout,
  verifyClientsToken,
  generateClientsJWT
};
