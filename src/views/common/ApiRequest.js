import api from '../../service/api';
import { ApiRequestErrorHandler } from './ApiRequestErrorHandler';

/**
 * ApiRequest(value)
 * value = {
 *   method: 'get' | 'post' | 'put' | 'patch' | 'delete',
 *   url: '/path',
 *   params: {},     // for GET: query, for others: body
 *   type: 'blob' | 'json' | ..., // optional responseType
 *   headers: { ... } // optional
 * }
 *
 * Returns:
 *   - if OK: axios response (same as before)
 *   - if NG: { flag:false, message:..., data:... }
 */
export const ApiRequest = async (value) => {
  let result, responseType, parameter, message;

  // responseType
  responseType = value.type ?? '';

  // Build axios config (use our instance 'api', so no baseURL here)
  if (['post', 'patch', 'put', 'delete'].includes((value.method || '').toLowerCase())) {
    parameter = {
      method: value.method,
      url: value.url,
      data: value.data || value.params || null,   // <-- IMPORTANT
      responseType: responseType || undefined,
      headers: value.headers,
    };
  } else {
    parameter = {
      method: value.method,
      url: value.url,
      params: value.params,
      responseType: responseType || undefined,
      headers: value.headers,
    };
  }

  try {
    const response = await api(parameter);

    // call api response error handler (keep your behavior)
    const ok = await ApiRequestErrorHandler(response);

    if (ok === true) {
      result = response;
    } else {
      result = { flag: false, message: ok, data: response };
    }
  } catch (error) {
    try {
      const serverResponse = error?.response;
      const msg = await ApiRequestErrorHandler(serverResponse);
      result = { flag: false, message: msg, data: serverResponse };
    } catch (error1) {
      if (error1?.response) {
        if (error?.response) {
          result = {
            flag: false,
            message: error.response.data?.message,
            data: error.response.data?.data,
          };
        } else {
          let data = { status: 'OK' };
          result = {
            flag: false,
            message: ['Cannot connect to server'],
            data,
          };
        }
      } else {
        let data = { status: 'OK' };
        result = {
          flag: false,
          message: ['Cannot connect to server'],
          data,
        };
      }
    }
  }

  return result;
};
