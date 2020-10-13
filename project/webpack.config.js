const path = require('path');

module.exports = {
  entry: ["./src/public/client.js"],
  output: {
    path: path.resolve(__dirname, './src/public/dist'),
    filename: 'js/bundle.js',
  }
};
