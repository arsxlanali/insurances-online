var express = require('express');
var cors = require('cors');
var axios = require('axios');
var cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { makeRequest, transformObjectToArray } = require('./utils/index');
const { ApiUrls, generateUrl } = require('./utils/api');
require('dotenv').config();
const mailchimpClient = require('@mailchimp/mailchimp_transactional')(
  process.env.MAILCHIMP_API
);

var app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // Replace with your frontend domain
  })
);

// Middleware to check token expiration
const myCache = new NodeCache();

function getHeader(mandant) {
  const token = myCache.get(mandant);
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

app.use('/:mandant', async (req, res, next) => {
  const mandant = req?.params?.mandant;
  if (myCache.get(mandant)) {
    return next();
  }
  try {
    const body = {
      systemUser: process.env[`${mandant.toUpperCase()}_SYSTEM_USER`],
      password: process.env[`${mandant.toUpperCase()}_PASSWORD`],
      systemTime: Date.now().toString(),
    };
    const response = await axios.post(
      generateUrl(ApiUrls.AUTH_LOGIN),
      body,
      getHeader(mandant)
    );

    const token = response.data.value;
    const timeout = parseInt(process.env.TOKEN_TIMEOUT) / 1000;
    success = myCache.set(mandant, token, timeout);
    return next();
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/:mandant/user/sendToken/:onlineUserName', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const onlineUserName = req?.params?.onlineUserName;
    const response = await makeRequest({
      method: 'post',
      url: generateUrl(ApiUrls.SEND_TOKEN),
      body: {onlineUserName:onlineUserName},
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post('/:mandant/calculate/tariffs/additional', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const response = await makeRequest({
      method: 'post',
      url: generateUrl(ApiUrls.CALCULATE_TARIFFS_ADDITIONAL),
      body: req.body,
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});
app.get('/:mandant/calculate/insurances/additional', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const response = await makeRequest({
      method: 'get',
      url: generateUrl(ApiUrls.CALCULATE_INSURANCES_ADDITIONAL),
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.get(
  '/:mandant/occupation/additional/insurance/:insuranceId/search',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const insuranceId = req.params.insuranceId;
      const searchText = req.query.fulltext;
      const gender = req.query.gender;
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          `${ApiUrls.OCCUPATION_SEARCH}/${insuranceId}/search?fulltext=${searchText}&gender=${gender}`
        ),
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.post('/:mandant/order/startriskcheck/additional', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const response = await makeRequest({
      method: 'post',
      url: generateUrl(ApiUrls.ORDER_STARTRISKCHECK_ADDITIONAL),
      body: req.body,
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post('/:mandant/order/checkriskcheck/additional', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const response = await makeRequest({
      method: 'post',
      url: generateUrl(ApiUrls.ORDER_CHECKRISKCHECK_ADDITIONAL),
      body: req.body,
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post('/:mandant/order/submitOrder/additional', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const response = await makeRequest({
      method: 'post',
      url: generateUrl(ApiUrls.ORDER_SUBMITORDER_ADDITIONAL),
      body: req.body,
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.get(
  '/:mandant/calculate/tariffs/additional/:tariffId/documents',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const tariffId = encodeURIComponent(req.params.tariffId);
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          ApiUrls.CALCULATE_TARIFFS_DOCUMENTS.replace(':tariffId', tariffId)
        ),
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.post(
  '/:mandant/calculate/tariffs/full/',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const response = await makeRequest({
        method: 'post',
        url: generateUrl(
          ApiUrls.CALCULATE_TARIFFS_FULL
        ),
        body: req.body,
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.get(
  '/:mandant/calculate/maritalstates/full/',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          ApiUrls.CALCULATE_MARITALSTATES_FULL
        ),
        // body: req.body,
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.get(
  '/:mandant/calculate/benefitstypes/full/',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          ApiUrls.CALCULATE_BENEFIT_TYPES_FULL
        ),
        // body: req.body,
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);



app.get(
  '/:mandant/calculate/occupationgroups/full/',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          ApiUrls.CALCULATE_OCCUPATIONGROUPS_FULL
        ),
        // body: req.body,
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.get(
  '/:mandant/calculate/benefits/full/',
  async (req, res) => {
    try {
      const mandant = req?.params?.mandant;
      const response = await makeRequest({
        method: 'get',
        url: generateUrl(
          ApiUrls.CALCULATE_BENEFITS_FULL
        ),
        // body: req.body,
        headers: getHeader(mandant),
      });
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

app.get('/:mandant/order/eventData/:riskCheckId', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const riskCheckId = req.params.riskCheckId;
    const response = await makeRequest({
      method: 'get',
      url: generateUrl(
        ApiUrls.ORDER_EVENTDATA.replace(':riskCheckId', riskCheckId)
      ),
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.get('/:mandant/optimize/tariff/additional/:tarrifId', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;
    const tarrifId = req.params.tarrifId;
    const response = await makeRequest({
      method: 'get',
      url: generateUrl(
        ApiUrls.OPTIMIZE_TARIFF_QUALITY.replace(':tarrifId', tarrifId)
      ),
      headers: getHeader(mandant),
    });
    res.status(200).json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post('/:mandant/email/send/:riskCheckId/:tariffId', async (req, res) => {
  try {
    const mandant = req?.params?.mandant;

    let attachments1 = [];
    let attachments2 = [];

    if (req.body.sendAttachments) {
      const riskCheckId = req.params.riskCheckId;
      const tariffId = encodeURIComponent(req.params.tariffId);
      const response1 = await axios.get(
        `${process.env.BASE_URL}/order/eventData/${riskCheckId}`,
        getHeader(mandant)
      );
      if (response1.data.config) {
        delete response1.data.config;
      }
      attachments1 = response1?.data?.value?.documents.map((attachment) => {
        return {
          name: `${attachment?.displayName}.${attachment?.fileType}`,
          type: 'application/pdf',
          content: attachment?.content,
        };
      });

      const response2 = await axios.get(
        `${process.env.BASE_URL}/calculate/tariffs/additional/${tariffId}/documents`,
        getHeader(mandant)
      );

      if (response2.data.config) {
        delete response2.data.config;
      }
      attachments2 = response2?.data?.value
        ?.filter((attachment) =>
          req?.body?.documentsId.includes(attachment.documentId)
        )
        .map((attachment) => {
          return {
            name: `${attachment?.displayName}.${attachment?.fileType}`,
            type: 'application/pdf',
            content: attachment?.content,
          };
        });
    }

    const attachments = [...attachments1, ...attachments2];

    const { data, to, subject, template_name } = req.body;

    // adding orderDate 
    const currentDate = new Date();
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    };
    const formattedOrderDate = currentDate.toLocaleString('de-DE', options).replace(',', ' -');

    const message = {
      subject: subject,
      attachments,
      binary: true,
      merge_vars: [
        {
          rcpt: to,
          vars: transformObjectToArray({ ...data, formattedOrderDate }),
        },
      ],
      to: [
        {
          email: to,
          type: 'to',
        },
      ],
    };
    const response = await mailchimpClient.messages.sendTemplate({
      template_name,
      template_content: [],
      message,
    });
    res.status(200).send(response);
  } catch (error) {
    if (error.config) {
      delete error.config;
    }
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// module.exports = { getHeader };
