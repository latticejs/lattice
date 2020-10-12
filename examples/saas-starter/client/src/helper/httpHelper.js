import { isIE11 } from './resolutionHelper';
import axios from 'axios';

/**
 * API calling module
 * @param  {Object} httpObj          [HTTP confirguration object]
 * @param  {Function} successHandler [Success Callback]
 * @param  {Function} errorHandler   [Failure Callback]
 * @return {Objet Callback}          [Return Object Callback]
 */
export default function requestData(httpObj, successHandler, errorHandler, isJSON = true, updateProgressBarValue) {
  let hostName = process.env.REACT_APP_IMAGE_SERVER_HOST;
  let port = process.env.REACT_APP_IMAGE_SERVER_PORT || '';

  if (httpObj.fileType === 'video') {
    hostName = process.env.REACT_APP_VIDEO_SERVER_HOST;
    port = process.env.REACT_APP_VIDEO_SERVER_PORT || '';
  }

  let serverUrl = `${hostName}`;
  if (port) {
    serverUrl = `${hostName}:${port}/`;
  }

  let paramsInfo = httpObj.params;

  if (isIE11()) {
    paramsInfo = {
      ...{
        timeFresher: new Date().getTime(),
      },
      ...httpObj.params,
    };
  }

  let httpData = JSON.stringify(httpObj.data);

  if (!isJSON) {
    httpData = httpObj.data;
  }

  return axios
    .request({
      url: httpObj.url,
      method: httpObj.method || 'post',
      baseURL: httpObj.baseURL || serverUrl,
      headers: {
        ...{
          'Content-Type': 'application/json',
        },
        ...httpObj.headers,
      },
      params: paramsInfo,
      timeout: 40000,
      data: httpData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable && updateProgressBarValue) {
          updateProgressBarValue(progressEvent);
        }
      },
    })
    .then(successHandler, errorHandler);
}
