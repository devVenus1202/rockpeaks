const path = require('path');

// FIXME:
// See webpack.config.js for original.

// Export a function. Accept the base config as the only param.
module.exports = {
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // config.module.rules.push({
    //   test: /\.mjs$/,
    //   include: /node_modules/,
    //   type: 'javascript/auto',
    // });

    config.module.rules.push({
      test: /\.(scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // config.module.rules.push({
    //   test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
    //   use: {
    //     loader: 'url-loader',
    //     options: {
    //       limit: 100000,
    //       name: '[name].[ext]',
    //     },
    //   },
    // });

    // Return the altered config
    return config;
  },
};
