import axios from 'axios';

/**
 * API calling module
 * @param  {Object} httpObj          [HTTP confirguration object]
 * @param  {Function} successHandler [Success Callback]
 * @param  {Function} errorHandler   [Failure Callback]
 * @return {Objet Callback}          [Return Object Callback]
 */
export default function requestData(httpObj, successHandler, errorHandler, isJSON = true) {
  let httpData = JSON.stringify(httpObj.data);
  const serverUrl = 'https://restcountries.eu/rest/v2';
  return axios
    .request({
      url: httpObj.url,
      method: httpObj.method || 'post',
      baseURL: httpObj.baseURL || serverUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      params: httpObj.params,
      timeout: 40000,
      data: httpData,
    })
    .then(successHandler, errorHandler);
}
