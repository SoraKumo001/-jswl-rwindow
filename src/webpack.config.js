const path = require("path");

const config = {
  mode: "production",
  //mode: "development",
  entry: path.resolve(__dirname, "index.ts"),
  output: {
    libraryTarget: "commonjs",
    filename: "index.js",
    path: path.resolve(__dirname, "..", "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "babel-plugin-styled-components",
                  {
                    minify: true,
                  },
                ],
              ],
            },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: "url-loader",
      },
    ],
  },
  resolve: {
    symlinks: false,
    extensions: [".ts", ".tsx", ".js", ".scss", "css", ".svg"],
  },
  externals: {
    react: true,
    "styled-components": true,
  },
  devtool: "source-map",
};

module.exports = config;
