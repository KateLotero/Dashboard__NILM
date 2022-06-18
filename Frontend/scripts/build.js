const rewire = require('rewire')
const webpack = require('webpack')
const defaults = rewire('react-scripts/scripts/build.js')

//In order to override the webpack configuration without ejecting the create-react-app
const config = defaults.__get__('config')

//Customize the webpack configuration here.
config.resolve.fallback = {
  ...config.resolve.fallback,
  process: require.resolve('process/browser'),
  zlib: require.resolve('browserify-zlib'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
  buffer: require.resolve('buffer'),
  asset: require.resolve('assert'),
}

config.plugins = [
  ...config.plugins,
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),
]
