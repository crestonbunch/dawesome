var webpack = require('webpack');
var copy = require('copy-webpack-plugin');
var path = require('path');
var uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./app/index.tsx",
    output: {
        filename: "./dist/bundle.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".scss"],
        alias: {
            "lib": path.resolve("./lib"),
            "components": path.resolve("./lib/components"),
            "styles": path.resolve("./lib/styles")
        }
    },

    module: {
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: "source-map-loader" },
            { enforce: 'pre', test: /\.tsx?$/, loader: "source-map-loader" },
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] }
        ],
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux",
        "react-redux": "ReactRedux",
    },

    plugins: [
      new copy([
        { from: 'static/', to: 'dist/' },
        { from: 'node_modules/react/dist/react.js', to: 'dist/' },
        { from: 'node_modules/react/dist/react.min.js', to: 'dist/' },
        { from: 'node_modules/react-dom/dist/react-dom.js', to: 'dist/' },
        { from: 'node_modules/react-dom/dist/react-dom.min.js', to: 'dist/' },
        { from: 'node_modules/redux/dist/redux.js', to: 'dist/' },
        { from: 'node_modules/redux/dist/redux.min.js', to: 'dist/' },
        { from: 'node_modules/react-redux/dist/react-redux.js', to: 'dist/' },
        { from: 'node_modules/react-redux/dist/react-redux.min.js', to: 'dist/' },
        { from: 'node_modules/core-js/client/shim.min.js', to: 'dist/' },
      ]),
      /*
      new uglify({
          sourceMap: true
      })
      */
    ],
};


