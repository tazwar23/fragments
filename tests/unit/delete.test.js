const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  let fragmentId;

  beforeAll(async () => {
    // POST a new fragment to get its ID for deletion
    const postResponse = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment to be deleted');

    expect(postResponse.statusCode).toBe(201);
    expect(postResponse.body.status).toBe('ok');
    fragmentId = postResponse.body.fragment.id;
  });

  test('Expect DELETE to successfully delete a fragment', async () => {
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.status).toBe('ok');
  });

  test('Expect DELETE with non-existent ID to return status 404', async () => {
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/678968`)
      .auth('user1@email.com', 'password1');

    expect(deleteResponse.statusCode).toBe(404);
    expect(deleteResponse.body.status).toBe('error');
  });
});
