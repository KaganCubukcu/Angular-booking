const { stripPassword } = require('../controllers/UserController');

describe('stripPassword', () => {
  test('removes password from plain user object', () => {
    const user = { _id: '123', email: 'a@example.com', password: 'secret', isAdmin: false };
    const sanitized = stripPassword(user);
    expect(sanitized).not.toHaveProperty('password');
    expect(sanitized.email).toBe(user.email);
    expect(sanitized._id).toBe(user._id);
  });

  test('removes password from mongoose document via toObject', () => {
    const doc = {
      toObject: () => ({ _id: '456', email: 'b@example.com', password: 'hash', isAdmin: true }),
    };
    const sanitized = stripPassword(doc);
    expect(sanitized).not.toHaveProperty('password');
    expect(sanitized.email).toBe('b@example.com');
    expect(sanitized.isAdmin).toBe(true);
  });
});
