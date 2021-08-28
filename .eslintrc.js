module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  rules: {},
  overrides: [
    {
      files: ['gulpfile.js'],
      env: {
        node: true,
        es2021: true
      }
    }
  ]
};
