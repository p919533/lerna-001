import { useState, useRef, forwardRef } from 'react';
import { message } from 'antd';
import { setItem } from 'utils';
import * as api from 'services';
import cookie from 'react-cookies';
import * as H from 'history';
import { uuid as newUuid } from 'utils';
import DefalutLogin, { SubmitValues } from './default-login';
import BindPhone from './bind-phone';
import ThirdPartRegisterSuccess from './success';
import Unauthenticated from '../index';
import { useEffect } from 'react';
const getUserType = (typeArray: string[]) => {
    return typeArray.filter((type) => type === 'login' || type === 'user');
};

const BindPhoneForm = forwardRef<any, any>((props, ref) => (
    <BindPhone {...props} ref={ref} />
));

interface Props {
    history: H.History;
}
export default function Login(props: Props) {
    // 需要展示的 element
    const [switchType, setSwitchType] = useState('default');
    const [isFirstRegister, setIsFirstRegister] = useState(true);
    // 用户名
    const [checkStatus, setCheckStatus] = useState(false);
    const [registerUserName, setRegisterUserName] = useState('');
    // 密码
    const [registerPassword, setRegisterPassword] = useState('');
    const [defaultCheck, setDefaultCheck] = useState(false);
    const userData = useRef<any>(null);
    const responseData = useRef<any>(null);

    // 默认登录
    // const formRef = useRef();
    // 用于获取基本信息
    const timer = useRef(0);
    // 轮询器, 用于判断 第三方链接登录窗口是否被关闭
    const pollTimer = useRef(0);
    // 第三方登录链接窗口;
    const thirdPartTab = useRef<any>(null);
    const userType = useRef<string | null>(null);
    // 注册的用户是否是通过审核的用户
    const registerIsPermitFlag = useRef<boolean>(true);
    // boolean 用于判断 第三方链接登录窗口是否被关闭
    const newWindowIsClosed = useRef<any>(null);
    useEffect(() => {
        let token = cookie.load('bos_access_token');
        if (token) {
            setDefaultCheck(true);
            setCheckStatus(true);
        }
    }, []);
    /**
     * 登陆成功回调
     * @param {Object} res 登陆接口返回数据
     */
    const setDataBySuccess = async (res: any) => {
        cookie.save('accessToken', res.access_token, { path: '/' });
        // 数据模型管理使用
        cookie.save('bos_access_token', res.access_token, { path: '/' });
        setItem('userInfo', res.user);
        // 数据模型管理使用
        setItem('bos_user', res.user);
        onOpen('/');
    };
    const itemChange = (item: any) => {
        setCheckStatus(item.target.checked);
    };
    /**
     * 登录成功
     *
     */
    const handleSubmit = async (values: SubmitValues) => {
        values.isRemember = checkStatus;
        try {
            const res = await api.login({
                data: values
            });
            setDataBySuccess(res);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const onOpen = (pathname: string) => {
        props.history.push({
            pathname
        });
    };
    /**
     *
     * @param {Object} data  接口返回信息
     */
    const showErrorDetail = (data: { code: string; message: string }) => {
        clearInterval(timer.current);
        if (data.code === 'USER_NOT_PERMIT') {
            message.error('注册账号未通过审核, 需要管理员进行审核');
        } else if (data.code === 'THIRD_LOGIN_CALLBACK_ERROR') {
            message.error(
                '该应用已存在手机号关联用户名, 请尝试使用手机号或对应的用户名登录'
            );
        } else {
            message.error(data.message);
        }
    };

    /**
     *
     * @param {String} type 当前第三方登陆的方式：link（链接方式），QRCode（二维码）
     * @param {Object} data
     */
    const getUserInfoToCheckIfBindPhone = async (
        type: string,
        uuid: string
    ) => {
        if (type === 'wxOpen') {
            type = 'wx';
        }
        const res: any = await api.getUserInfo({
            params: { uuid, type }
        });

        if (res.data === null) {
            if (!!thirdPartTab.current) {
                // 出现特殊情况，关闭链接窗口
                thirdPartTab.current.close();
            }
            // 出现特殊情况
            showErrorDetail(res);
        } else {
            let responseDataKeys = getUserType(Object.keys(res.data));
            if (responseDataKeys.length !== 0) {
                userType.current = responseDataKeys[0];
                userData.current = res.data[userType.current];
                if (!userData.current) {
                    message.error('获取登录信息失败');
                }
                responseData.current = res;
                if (!!thirdPartTab.current) {
                    thirdPartTab.current.close();
                }
                //登录成功，取消监听
                clearInterval(timer.current);
                if (userType.current === 'user') {
                    // 临时用户情况  需要用户绑定手机号
                    setSwitchType('bindPhone');
                } else if (userType.current === 'login') {
                    // 已经绑定用户，不需要用户再绑定手机号
                    if (responseData.current.code === 'SUCCESS') {
                        setDataBySuccess(
                            responseData.current.data[userType.current]
                        );
                    } else {
                        message.error(responseData.current.message);
                    }
                }
            }
        }
    };

    // 监听是否关闭扫码窗口
    function listenerNewTabClosedState() {
        window.clearInterval(pollTimer.current);
        // 开始进行监听页面是否被关闭
        pollTimer.current = window.setInterval(() => {
            newWindowIsClosed.current = thirdPartTab.current.closed;
            if (newWindowIsClosed.current) {
                window.clearInterval(pollTimer.current);
                setTimeout(() => {
                    if (newWindowIsClosed.current) {
                        clearInterval(timer.current);
                    }
                }, 1);
            }
        }, 500);
    }

    /**
     * 打开第三方登录链接
     * @param {*} type wx(微信开放平台) ;qq(QQ)
     */
    const createThirdPartLink = (type: string) => {
        let uuid = `※${newUuid()}※${type}`;
        let urlType = type + 'Url';
        api.getUrl({
            params: {
                uuid
            }
        }).then((url: any) => {
            timer.current = window.setInterval(() => {
                getUserInfoToCheckIfBindPhone(type, uuid);
            }, 1000);

            thirdPartTab.current = window.open(url.data[urlType], '_blank');
            // 监听是否关闭扫码窗口;
            listenerNewTabClosedState();
        });
    };

    // 点击第三方登陆按钮  'qq' | 'wxOpen'
    const thirdPartLogIn = (type: string) => {
        clearInterval(timer.current);
        // 如果打开了 qq 连接，没有授权 qq，会导致一直请求用户数据， 目前解决方法是点击第三方 icon 的时候清除定时器
        //qq  xOpen
        createThirdPartLink(type);
    };

    /**
     * 跳转到注册成功提示页面
     * @param {*} userName
     * @param {*} bindPhone
     */
    const registerAndBindSuccess = (data: any, isRegister: boolean) => {
        let userName = data.user.name;
        let password = `${data.user.telephone.substring(3)}`;
        registerIsPermitFlag.current = isRegister;
        userData.current = data;
        setSwitchType('thirdPartRegisterSuccess');
        setIsFirstRegister(true);
        setRegisterUserName(userName);
        setRegisterPassword(password);
    };

    /**
     * 出来第三方账号注册后登录操作
     */
    const handleEnterApp = () => {
        if (registerIsPermitFlag.current) {
            setDataBySuccess(userData.current);
        } else {
            // 需要展示的 element
            setSwitchType('default');
            // 用户未绑定手机 + 未绑定微信号
            setIsFirstRegister(true);

            timer.current = 0; // 用于存放 timer
            responseData.current = null; // 响应返回数据
            userData.current = null; // 用户信息
            thirdPartTab.current = null;
            userType.current = '';
        }
    };

    const renderElement = () => {
        return {
            // 手机绑定
            bindPhone: (
                <BindPhoneForm
                    tabLogin={thirdPartLogIn}
                    userData={userData.current}
                    setDataBySuccess={setDataBySuccess}
                    registerAndBindSuccess={registerAndBindSuccess}
                />
            ),
            //绑定成功
            thirdPartRegisterSuccess: (
                <ThirdPartRegisterSuccess
                    userName={registerUserName}
                    password={registerPassword}
                    isFirstRegister={isFirstRegister}
                    onEnterApp={handleEnterApp}
                />
            ),
            // 默认登录
            default: (
                <DefalutLogin
                    onSubmit={handleSubmit}
                    tabLogin={thirdPartLogIn}
                    itemChange={itemChange}
                    defaultCheck={defaultCheck}
                    // loginScuess={loginScuess}
                />
            )
        }[switchType];
    };

    return (
        <Unauthenticated title="密码登录">{renderElement()}</Unauthenticated>
    );
}
