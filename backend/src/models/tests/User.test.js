const mongoose = require('mongoose');
const User = require('../User');
const bcrypt = require('bcryptjs');

// Mock bcrypt functions
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should hash the password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };

    const user = new User(userData);
    await user.save();

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    expect(user.password).toBe('hashedPassword');
  });

  it('should not hash password if it is not modified', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword', // Already hashed
      role: 'user',
    };

    const user = new User(userData);
    
    // Simulate a save where password isn't modified
    user.isModified = jest.fn().mockReturnValue(false);
    
    await user.save();

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should correctly compare passwords', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    const user = new User(userData);
    const isMatch = await user.matchPassword('password123');

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(isMatch).toBe(true);
  });

  it('should generate a JWT token', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    const user = new User(userData);
    user._id = 'user_id';

    process.env.JWT_SECRET = 'testsecret';
    process.env.JWT_EXPIRE = '30d';

    const token = user.getSignedJwtToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
