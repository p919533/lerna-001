const packageName = require('./package.json').name;
const path = require('path')

/* craco.config.js */
module.exports = {
    devServer: {
        port: '4000',
        // 允许跨域
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
    babel: {
        "plugins": [
            "@emotion",
            {
                // sourceMap is on by default but source maps are dead code eliminated in production
                "sourceMap": true,
                "autoLabel": "dev-only",
                "labelFormat": "[local]",
                "cssPropOptimization": true
            }
        ]
    },
    webpack: {
        alias: {
            "react": path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            "@emotion/styled": path.resolve('./node_modules/@emotion/styled'),
        },
        configure: (webpackConfig, { env, paths }) => {
            console.log('webpackConfig=====')
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            webpackConfig.output.library = packageName;
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            webpackConfig.output.libraryTarget = 'umd';
            // 按需加载相关，设置为 webpackJsonp_MicroAppOrde 即可
            webpackConfig.output.jsonpFunction = `webpackJsonp_${packageName}`;
            return webpackConfig;
        }
    }
};
