import { IpHostnameMiddleware } from './ip-hostname.middleware';

describe('IpHostnameMiddleware', () => {
  it('should be defined', () => {
    expect(new IpHostnameMiddleware()).toBeDefined();
  });
});
