module.exports = {
  extends: ['turbo', 'prettier'],
  rules: {
    'node/no-extraneous-import': 'off', // <---- for now!
    'node/no-missing-import': 'off', // <---- /stubs/** */ for now!
    // '@next/next/no-html-link-for-pages': 'off',
  },
}
