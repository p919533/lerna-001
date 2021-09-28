import { Layout as AntLayout, Menu, Breadcrumb } from 'antd';
import { renderRoutes } from 'react-router-config';
import Logo from 'assets/logo.png';

const { Header, Content, Footer } = AntLayout;

export function Layout(props: any) {
    const { route } = props;
    return (
        <AntLayout style={{ minHeight: 'calc(100vh)' }}>
            <Header className="header">
                <img src={Logo} alt="盈嘉互联" width="150" />
            </Header>
            {/* 显示子应用的容器 */}
            <Content style={{ minHeight: 'calc(100vh - 140px)' }} id="sub-root">
                {renderRoutes(route.routes)}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                京公网安备 11010702001922号 京ICP备15051988号-9 Copyright © 2021
                盈嘉互联版权所有，任何商业用途均须联系作者
            </Footer>
        </AntLayout>
    );
}
