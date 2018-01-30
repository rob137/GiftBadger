exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  'mongodb://localhost/gift-app';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  global.DATABASE_URL ||
  'mongodb://localhost/test-gift-app';
exports.PORT = process.env.PORT || 5000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
