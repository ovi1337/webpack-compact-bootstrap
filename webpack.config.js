const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const AutoPrefixer = require("autoprefixer");
const CssNano = require("cssnano");

const devMode = process.env.NODE_ENV !== "production";

const PATHS = {
    src: path.join(__dirname, "src"),
    dist: path.resolve(__dirname, "dist")
};

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: PATHS.dist
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? "[name].css" : "[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
            ignoreOrder: false
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ],
    devServer: {
        contentBase: "./dist",
        hot: true,
        host: "localhost"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === "development",
                            reloadAll: true
                        }
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [AutoPrefixer, CssNano]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    }
};
