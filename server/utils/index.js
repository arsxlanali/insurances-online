const axios = require('axios');
require('dotenv').config();
// const { getHeader } = require('../server');

function getHeader(mandant, myCache) {
  const token = myCache?.get(mandant);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': process.env[`${mandant.toUpperCase()}_X_API_KEY`],
    'X-Transaction-Id': process.env.X_TRANSACTION_ID,
  };
  if (token) {
    headers['X-Levelnine-Authorization'] = `Bearer ${token}`;
  }
  return {
    auth: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
    headers,
  };
}

function transformObjectToArray(obj) {
  const newArray = [];
  for (const [key, value] of Object.entries(obj)) {
    newArray.push({
      name: key,
      content: value,
    });
  }

  return newArray;
}

async function makeRequest({
  url,
  method,
  body,
  headers: { auth, headers },
  retryCount = 0,
}) {
  try {
    let response;
    if (body) {
      response = await axios[method](url, body, { auth, headers });
    } else {
      response = await axios[method](url, { auth, headers });
    }

    if (response.data.config) {
      delete response.data.config;
    }
    if (response.data.success) {
      return response.data;
    } else {
      if (retryCount < parseInt(process.env.MAX_RETRIES)) {
        await delay(parseInt(process.env.RETRY_INTERVAL));
        return makeRequest({
          url,
          method,
          body,
          headers: { auth, headers },
          retryCount: retryCount + 1,
        });
      } else {
        throw {
          message: 'Max retries reached. Unable to get a successful response.',
        };
      }
    }
  } catch (error) {
    if (error.config) {
      delete error.config;
    }
    throw error;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { makeRequest, transformObjectToArray };
