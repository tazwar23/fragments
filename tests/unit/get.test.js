// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('Expect get one to have correct data', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');

    const location = res.headers['location'];
    const v1Index = location.indexOf('/v1');
    const v1Part = location.substring(v1Index);
    const getRes = await request(app).get(`${v1Part}`).auth('user1@email.com', 'password1');
    expect(getRes.text).toBe('This is a fragment');
  });
  test('Expect get one to give 404 if url isnt correct ', async () => {
    const res = await request(app).get('/v1/fragments/s53245').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
