const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new Dotenv({ path: `./.env.${process.env.ENV}` }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          http: require.resolve('stream-http'),
          buffer: require.resolve('buffer'),
        },
      },
    },
  },
};
