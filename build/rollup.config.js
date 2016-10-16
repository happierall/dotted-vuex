const buble = require('rollup-plugin-buble')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/dotted-vuex.js',
  format: 'umd',
  moduleName: 'DottedVuex',
  plugins: [buble()],
  banner:
`/**
 * DottedVuex v${version}
 * (c) ${new Date().getFullYear()} Ruslan Ianberdin
 * @license MIT
 */`
}