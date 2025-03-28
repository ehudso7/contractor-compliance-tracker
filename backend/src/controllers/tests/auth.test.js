const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const Company = require('../../models/Company');

let mongoServer;

// Set up the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the database between tests
afterEach(async () => {
  await User.deleteMany({});
  await Company.deleteMany({});
});

describe('Authentication Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and company', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          companyName: 'Test Company'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('company');
      
      // Check if user was actually created in database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeDefined();
      expect(user.name).toBe('Test User');
      
      // Check if company was created
      const company = await Company.findById(user.company);
      expect(company).toBeDefined();
      expect(company.name).toBe('Test Company');
      expect(company.trialEndsAt).toBeDefined();
    });
    
    it('should not register user with existing email', async () => {
      // Create a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123',
          companyName: 'Existing Company'
        });
      
      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password456',
          companyName: 'New Company'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should validate input fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123', // too short
          companyName: ''
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      // Create a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test',
          email: 'login@example.com',
          password: 'password123',
          companyName: 'Login Company'
        });
      
      // Try to login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', 'Login Test');
    });
    
    it('should not login with incorrect password', async () => {
      // Create a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Password Test',
          email: 'password@example.com',
          password: 'password123',
          companyName: 'Password Company'
        });
      
      // Try to login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'password@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      // Register user and get token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Profile Test',
          email: 'profile@example.com',
          password: 'password123',
          companyName: 'Profile Company'
        });
      
      const token = registerRes.body.token;
      
      // Get current user profile
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Profile Test');
      expect(res.body).toHaveProperty('email', 'profile@example.com');
    });
    
    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
