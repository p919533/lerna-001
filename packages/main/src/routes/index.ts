import { renderRoutes } from 'react-router-config';
import { Layout } from 'components/layout';
//登录页
import Login from 'pages/unauthenticated/login';
//注册
import Register from 'pages/unauthenticated/register';
//忘记密码
import Reset from 'pages/unauthenticated/reset';
//盈嘉互联用户协议 / 隐私条款
import { Deal, PrivacyClause } from 'pages/unauthenticated/deal';

const GlobalLayout = ({ route }: any) => {
    return renderRoutes(route.routes);
};
const configRoute = [
    {
        path: '/docu',
        component: Layout
    },
    {
        path: '/',
        component: Layout,
        routes: [
            {
                path: '/',
                component: Login,
                exact: true
            },
            {
                path: '/login',
                component: Login
            },
            {
                path: '/register',
                component: Register
            },
            {
                path: '/reset',
                component: Reset
            },
            {
                path: '/deal',
                component: Deal
            },
            {
                path: '/privacy-clause',
                component: PrivacyClause
            }
        ]
    },
    
];
export default configRoute;
