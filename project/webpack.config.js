const path = require('path');

module.exports = {
  entry: ["./src/public/client.js"],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  }
};
