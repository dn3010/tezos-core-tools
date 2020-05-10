import _ from 'lodash';
import fetch from 'node-fetch';

export default class RpcClient {
  constructor(nodeAddress, options = {}) {
    this.address = nodeAddress;
    this.headers = options.headers;
  }

  get(path, headers = {}) {
    const mergeHeaders = this.mergeHeadersWithInitialized(headers);
    return fetch(this.getPathWithAddress(path), {
      method: 'GET',
      headers: mergeHeaders,
    });
  }

  post(path, payload, headers = {}) {
    if (!payload) {
      throw new Error('POST call requires a payload');
    }
    const mergeHeaders = this.mergeHeadersWithInitialized(headers);
    return fetch(this.getPathWithAddress(path), {
      method: 'POST',
      headers: mergeHeaders,
      body: JSON.stringify(payload)
    });
  }

  getPathWithAddress(path) {
    return `${this.address}${path}`
  }

  mergeHeadersWithInitialized(headers) {
    return _.merge(this.headers, headers);
  }
}
