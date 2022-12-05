import axios from 'axios';
import { SessionManager } from './SessionUtil/SessionManager';

export const Api = axios.create({
  baseURL: 'https://gmedia.bz/bapenda/api/',
  headers: {
    'Client-Service': 'monitoring-bapeda',
    'Auth-Key': 'gmedia',
    'Content-Type': 'application/json',
  },
});

Api.interceptors.request.use(
  async (request) => {
    //console.log(request, 'Cek Request');
    const session = SessionManager.GetAsObject('@session');
    if (session != null) {
      request.headers.common.id = session.id;
    }

    console.log('header', request.headers);
    if (request.data) {
      console.log('request ', JSON.stringify(request.data));
    } else {
      console.log('request no data');
    }
    return request;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  async (response) => {
    console.log('response', response.data);
    return response;
  },
  (error) => {
    console.log('error message api interceptors ' + error);
    let result = {
      status: '400',
      message: `Error : ${JSON.stringify(error.response)}`,
    };
    console.log(error);
    if (error === 'Error: Network Error') {
      result = {
        status: '400',
        message: 'Error : Cek Koneksi Anda.',
      };
    } else if (error.response.status) {
      switch (error.response.status) {
        case 401:
          result = {
            status: 'E',
            message: 'Error : Not Login or Token Expired.',
          };
          break;
        default:
          result = { status: 'E', message: 'Whoops, Something Bad happen. :)' };
          break;
      }
    }

    return Promise.reject(result);
  }
);

export const ApiMultiPart = axios.create({
  baseURL: 'https://gmedia.bz/bapenda/api/',
  headers: {
    'Client-Service': 'monitoring-bapeda',
    'Auth-Key': 'gmedia',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

ApiMultiPart.interceptors.request.use(
  async (request) => {
    //console.log(request, 'Cek Request');
    const session = SessionManager.GetAsObject('@session');
    if (session != null) {
      request.headers.common.Uid = session.uid;
      request.headers.common.Token = session.token;
      request.headers.common.Username = session.email;
    }

    console.log('header', request.headers);
    if (request.data) {
      console.log('request ', JSON.stringify(request.data));
    } else {
      console.log('request no data');
    }
    return request;
  },
  (error) => Promise.reject(error)
);

ApiMultiPart.interceptors.response.use(
  async (response) => {
    console.log('response', response.data);
    return response;
  },
  (error) => {
    console.log('error message api interceptors ' + error);
    let result = {
      status: '400',
      message: `Error : ${JSON.stringify(error.response)}`,
    };
    console.log(error);
    if (error === 'Error: Network Error') {
      result = {
        status: '400',
        message: 'Error : Cek Koneksi Anda.',
      };
    } else if (error.response.status) {
      switch (error.response.status) {
        case 401:
          result = {
            status: 'E',
            message: 'Error : Not Login or Token Expired.',
          };
          break;
        default:
          result = { status: 'E', message: 'Whoops, Something Bad happen. :)' };
          break;
      }
    }

    return Promise.reject(result);
  }
);
