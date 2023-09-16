const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  let fragmentId;

  beforeAll(async () => {
    // POST a new fragment and get its ID
    const postResponse = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');

    expect(postResponse.statusCode).toBe(201);
    expect(postResponse.body.status).toBe('ok');
    fragmentId = postResponse.body.fragment.id;
  });

  test('Expect PUT to update a fragment', async () => {
    const putResponse = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is an updated fragment');

    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body.status).toBe('ok');
    expect(putResponse.body.fragment.id).toBe(fragmentId);
    expect(putResponse.body.fragment.type).toBe('text/plain');
  });

  test('Expect PUT to return status 400 if Content-Type doesn’t match', async () => {
    const putResponse = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Content-Type', 'text/html')
      .auth('user1@email.com', 'password1')
      .send('This won’t work due to wrong content type');

    expect(putResponse.statusCode).toBe(400);
    expect(putResponse.body.status).toBe('error');
  });
  test('Expect PUT with non-existent ID to return status 404', async () => {
    const putResponse = await request(app)
      .put(`/v1/fragments/5678567846`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('Trying to update with a wrong ID');

    expect(putResponse.statusCode).toBe(404);
    expect(putResponse.body.status).toBe('error');
  });
});
