const request = require('supertest');

const app = require('../../src/app');

describe('Test for app', () => {
  test('Test for invalid request', () => request(app).get('/InvalidRoute').expect(404));
});
