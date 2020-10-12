module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    mocha: true,
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: { 
    "no-console": "off"
  },
};
