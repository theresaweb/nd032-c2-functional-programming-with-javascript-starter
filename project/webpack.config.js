const path = require('path');

module.exports = {
  entry: ["./src/public/client.js"],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        options: {
        presets: [
          [
          '@babel/preset-env',
              {
                targets: {
                  esmodules: true
                }
              }
          ],
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, './src/public/dist'),
    filename: 'js/bundle.js'
  }
};
