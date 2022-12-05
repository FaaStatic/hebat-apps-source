import { Api } from '../../../util/ApiManager';

export default class ServiceHelper {
  static async actionServicePost(endpoint, params) {
    let data = null;
    await Api.post(endpoint, params)
      .then((res) => {
        data = res;
      })
      .catch((err) => {
        console.log('Eror', err.message);
      });
    return data;
  }
  static async actionServicePostWithFormData(endpoint, params) {
    let data = null;
    await Api.post(endpoint, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        data = res;
      })
      .catch((err) => {
        console.log('Eror', err.message);
      });
    return data;
  }
  static async actionServiceGet(endpoint) {
    let data = null;
    await Api.get(endpoint)
      .then((res) => {
        data = res;
      })
      .catch((err) => {
        console.log('Eror', err.message);
      });
    return data;
  }
}
