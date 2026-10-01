const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(commonConfiguration, {
  // Production mode optimizes output; clean old files before each build.
  mode: "production",
  plugins: [new CleanWebpackPlugin()],
});
