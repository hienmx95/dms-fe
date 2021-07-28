import {AxiosError} from 'axios';
import queryString from 'querystring';

export const ERROR_TRACKING_PLATFORM: 'mobile' | 'web' = 'web';

export function createMattermostErrorMessage(error: AxiosError): string {
  let text: string = `${error.response?.request._url}\n`;
  text += `ErrorCode: ${error.response?.status}\n`;
  if (error.config?.params) {
    text +=
      '```json\n' +
      queryString.stringify(JSON.parse(error.config?.params)) +
      '\n```';
  }
  if (error.config?.data) {
    text += '```json\n' + error.config?.data + '\n```\n';
  }
  text += `Requested from ${ERROR_TRACKING_PLATFORM}\n`;
  return text;
}

