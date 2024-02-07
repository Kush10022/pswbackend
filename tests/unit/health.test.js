const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

// Get the version and author from our package.json
const { version, author } = require('../../package.json');
const {hostname} = require('os');

describe('/ health check', () => {
  test('should return HTTP 200 response', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    
  });

  test('should return Cache-Control: no-cache header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cache-control']).toEqual('no-cache');
  });

  test('should return status: ok in response', async () => {
    const res = await request(app).get('/');
    expect(res.body.status).toEqual('ok');
  });

  test('should return correct version, githubUrl, and author in response', async () => {
    const res = await request(app).get('/');
    expect(res.body.author).toEqual(author);
    expect(res.body.githubUrl.startsWith('https://github.com/')).toBe(true);
    expect(res.body.version).toEqual(version);
    expect(res.body.hostname).toEqual(hostname());
  });

  test('GET /nonexistent should return status 404 and an error message', async () => {
    const response = await request(app).get('/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.error.message).toBe('not found');
    expect(response.body.error.code).toBe(404);
  });

  test('GET /v1/prt should return status 200 and  message', async () => {
    const response = await request(app).get('/v1/prt').auth('user1@email.com','password1');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.message).toBe('Hello from the Protected API!');
  });

  test('GET /v1/unprt should return status 200 and  message', async () => {
    const response = await request(app).get('/v1/unprt');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.message).toBe('Hello from the Un-Protected API!');
  });

});