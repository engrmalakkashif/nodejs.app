const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to My Node.js App!');
  });
});

describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('GET /users', () => {
  it('should return list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThan(0);
  });
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toBe('Charlie');
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Incomplete' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});