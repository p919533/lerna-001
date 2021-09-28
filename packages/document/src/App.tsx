import React from 'react';
import { ConfigProvider } from 'antd';
import { BosDucumentTitle } from './components';
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.variable.min.css';
// import './index.less';

export default function Document() {
    return (
        <ConfigProvider locale={zhCN}>
            <React.Fragment>
                <BosDucumentTitle />
                <h1>nihao</h1>
            </React.Fragment>
        </ConfigProvider>
    );
}
