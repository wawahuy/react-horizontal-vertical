// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const cssIdentNameExcludes = [
  /react-horizontal-vertical[\\\/]dist[\\\/]index\.umd\.css/
];

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[local]_[hash:base64:5]',
      auto: (resourcePath) => {
        return !cssIdentNameExcludes.some(r => r.test(resourcePath));
      },
    }
  }
}

const config = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      // link node_modules/react & react-dom of RHV
      react: path.resolve('..', 'node_modules', 'react'),
      'react-dom': path.resolve('..', 'node_modules', 'react-dom')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  devServer: {
    host: "localhost",
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, cssLoader, "postcss-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, cssLoader, "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
