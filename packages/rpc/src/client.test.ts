import RpcClient from './client';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('RpcClient', () => {
  let subject;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('initializes with a node address with a protocol', () => {
      subject = new RpcClient('https://some-node-rpc.com');
      expect(subject.address).toEqual('https://some-node-rpc.com');
    })

    it('optionally allows pass headers used for calls', () => {
      const options = {
        headers: { Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' }
      }
      subject = new RpcClient('https://some-node-rpc.com', options);
      expect(subject.headers).toEqual({ Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' });
    });
  });

  describe('#get', () => {
    beforeEach(() => {
      const options = {
        headers: { Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' }
      }
      subject = new RpcClient('https://some-node-rpc.com', options);
    });

    it('makes a GET request', () => {
      subject.get('/chains/main/blocks/head');
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ method: 'GET' }));
    });

    it('makes a request to the path passed with the address', () => {
      subject.get('/chains/main/blocks/head');
      expect(fetch).toHaveBeenCalledWith('https://some-node-rpc.com/chains/main/blocks/head', expect.anything());
    });

    it('includes the header on the fetch call', () => {
      subject.get('/chains/main/blocks/head');
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' } }));
    });

    it('merges with initialized header with the passed header', () => {
      subject.get('/chains/main/blocks/head', { SomeHeader: 'Cool' });
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { SomeHeader: 'Cool', Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' } }));
    });

    it('overwrites if passed the same header key', () => {
      subject.get('/chains/main/blocks/head', { Authorization: 'foo' });
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { Authorization: 'foo' } }));
    });
  });

  describe('#post', () => {
    beforeEach(() => {
      const options = {
        headers: { Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' }
      }
      subject = new RpcClient('https://some-node-rpc.com', options);
    });

    it('makes a POST request', () => {
      subject.post('/chains/main/blocks/head', {});
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ method: 'POST' }));
    });

    it('makes a request to the path passed with the address', () => {
      subject.post('/chains/main/blocks/head', {});
      expect(fetch).toHaveBeenCalledWith('https://some-node-rpc.com/chains/main/blocks/head', expect.anything());
    });

    it('requires a payload', () => {
      expect(() => {
        subject.post('/chains/main/blocks/head');
      }).toThrow(/requires a payload/);
    })

    it('includes the stringified JSON payload in the request call', () => {
      subject.post('/chains/main/blocks/head', { some: 'payload' });
      expect(fetch).toHaveBeenCalledWith('https://some-node-rpc.com/chains/main/blocks/head', expect.objectContaining(
        { body: '{\"some\":\"payload\"}' } // eslint-disable-line no-useless-escape
      ));
    });

    it('includes the header on the fetch call', () => {
      subject.post('/chains/main/blocks/head', {});
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' } }));
    });

    it('merges with initialized header with the passed header', () => {
      subject.post('/chains/main/blocks/head', {}, { SomeHeader: 'Cool' });
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { SomeHeader: 'Cool', Authorization: 'Basic ZWx1c3VhcmlvOnlsYWNsYXZl' } }));
    });

    it('overwrites if passed the same header key', () => {
      subject.post('/chains/main/blocks/head', {}, { Authorization: 'foo' });
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(
        { headers: { Authorization: 'foo' } }));
    });
  });
});
