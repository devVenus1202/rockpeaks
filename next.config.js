const withSass = require('@zeit/next-sass');
require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = withSass({
  sassLoaderOptions: {
    sourceMap: true,
  },
  postcssLoaderOptions: {
    sourceMap: true,
  },
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
});
