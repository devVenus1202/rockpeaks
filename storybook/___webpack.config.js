const path = require('path');

// FIXME:  you can probably delete this file.  It was superceded by main.js for loading webpack config
// However, changes needed to be made, so this file is left for references.  rename to webpack.config.js to add it back to the compile.

module.exports = {
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
};
