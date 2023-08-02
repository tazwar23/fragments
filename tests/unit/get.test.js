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
  test('authenticated users get a fragments array with expanded details', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
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
  test('Expect get one to convert markdown fragments to .html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');

    const location = res.headers['location'];
    const v1Index = location.indexOf('/v1');
    const v1Part = location.substring(v1Index);
    const getRes = await request(app).get(`${v1Part}.html`).auth('user1@email.com', 'password1');
    expect(getRes.text).toBe('<p>This is a fragment</p>\n');
  });
  test('Expect getOne/info to give correct metadata for specified id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');

    const location = res.headers['location'];
    const v1Index = location.indexOf('/v1');
    const v1Part = location.substring(v1Index);

    const getAllRes = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');

    const getOneRes = await request(app).get(`${v1Part}/info`).auth('user1@email.com', 'password1');
    //Use the third object from getAll because two other objects have been created in the previous tests.
    expect(getAllRes.body.fragments[2]).toEqual(getOneRes.body.fragment);
  });
  test('Expect getOne/info to give 404 if url isnt correct ', async () => {
    const res = await request(app)
      .get('/v1/fragments/s53245/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
