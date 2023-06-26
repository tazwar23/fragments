const request = require('supertest');

const app = require('../../src/app');

describe('Post /v1/fragments', () => {
  test('Expect post to save a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });
});
