const baseConfig = require('../../jest.config.js')

module.exports = {
  ...baseConfig,
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {},
}
