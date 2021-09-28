import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    registerMicroApps,
    start,
    addGlobalUncaughtErrorHandler
} from 'qiankun';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { renderRoutes } from 'react-router-config';
import Routes from 'routes';
import 'antd/dist/antd.variable.min.css';
import './index.css';

// console.log('a=========', a)

ConfigProvider.config({
    theme: {
        primaryColor: '#0b80fd'
    }
});

ReactDOM.render(
    <React.StrictMode>
        <ConfigProvider locale={zhCN}>
            <Router>{renderRoutes(Routes)}</Router>
        </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// 注册微应用;
registerMicroApps(
    [
        {
            // 子应用的容器
            name: 'bos-model-doc', // app name registered
            // 子应用的入口js
            entry: '//localhost:4000',
            // 主应用显示子应用的容器
            container: '#sub-root',
            // 路由激活状态
            activeRule: '/docu'
        }
    ],
    {
        beforeLoad: (app) => {
            return Promise.resolve();
        },
        afterMount: (app) => {
            return Promise.resolve();
        }
    }
);

// addGlobalUncaughtErrorHandler((event) => {
//     console.error(event, 'event');
//     const { message: msg }:any = event;
//     if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
//         console.error('微应用加载失败，请检查应用是否可运行');
//     }
// });

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
