import queryString from 'qs';
import { errorAdapter } from 'utils/error';
import { apify } from '@/api/json-api/apify';

function querify(data) {
  return queryString.stringify(apify(data), { arrayFormat: 'brackets' });
}

function json(response) {
  const unlockedResponse = response.clone();
  return response.text().then(text => {
    try {
      const data = JSON.parse(text);
      return {
        data,
        headers: response.headers
      };
    } catch (err) {
      return { response: unlockedResponse };
    }
  });
}

function expectsPayload(method) {
  const normalizedMethod = method.toLowerCase();
  return ['post', 'put', 'patch'].includes(normalizedMethod);
}

export default async function ({
  url,
  data = {},
  method = 'get',
  headers = {},
  signal
}) {
  let requestUrl = url;
  const requestData = {
    method,
    headers: {
      'Content-type': 'application/json',
      ...headers
    },
    signal
  };

  if (expectsPayload(method)) {
    requestData.body = JSON.stringify(data);
  }

  if (['get', 'post', 'put', 'delete'].includes(method)) {
    const query = querify(data);
    requestUrl = query ? `${url}/?${query}` : `${url}/`;
  }

  const res = await fetch(requestUrl, requestData);

  if (res.ok) {
    return json(res);
  }

  const errors = await errorAdapter(res);

  return Promise.reject(errors);
}
