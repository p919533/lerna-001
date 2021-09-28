import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import * as api from 'services';

export const regExp: any = {
    user: /^[a-zA-Z][a-zA-Z0-9_]{5,23}$/,
    pass: /(?!^[0-9]+$)(?!^[A-Z]+$)(?!^[a-z]+$)(?!^[^A-z0-9]+$)^.{6,32}$/,
    telephone: /^1[34578]\d{9}$/,
    email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/
};

export const receiverLabel: any = {
    telephone: '手机号',
    email: '邮箱号'
};

export const validateCodeLabel: any = {
    telephone: '短信',
    email: '邮箱'
};

// 倒计时
export const useTimer = () => {
    const [time, setTime] = useState(60);
    const [disabled, setDisabled] = useState(true);
    const activeTimer = useRef(0);
    //按钮 获取验证码
    function onTimer() {
        setDisabled(true);
        activeTimer.current = window.setInterval(() => {
            setTime((preSecond) => {
                if (preSecond <= 1) {
                    setDisabled(false);
                    window.clearInterval(activeTimer.current);
                    // 重置秒数
                    return 60;
                }
                return preSecond - 1;
            });
        }, 1000);
    }

    useEffect(() => {
        return () => {
            clearInterval(activeTimer.current);
        };
    }, []);

    return { time, onTimer, disabled, setDisabled };
};

/**
 * 校验手机 | 邮箱唯一
 * 发送手机 | 邮箱短信
 *  @param type 手机 | 邮箱
 * */
export function useValidator() {
    const { time, onTimer, disabled, setDisabled } = useTimer();
    /**
     * 验证手机/邮箱
     * @param isSendEmailCode 注册页邮箱不需要发送验证码验证
     * */
    async function onValidator(
        type: string,
        value: string,
        page: string,
        isSendEmailCode: boolean = false
    ) {
        const label = receiverLabel[type];
        // 注册的邮箱可以为空
        if (isSendEmailCode && (/^[ ]*$/.test(value) || !value)) {
            return Promise.resolve();
        } else {
            setDisabled(true);
            if (/^[ ]*$/.test(value) || !value) {
                return Promise.reject(`${label}不能为空`);
            }
        }

        if (!regExp[type].test(value)) {
            return Promise.reject(`${label}格式错误`);
        } else {
            const res: any = await api.accountCheck({
                params: {
                    checkType: type,
                    value
                }
            });

            //注册
            if (res.data && page === 'register') {
                return Promise.reject(`该${label}已存在`);
            }
            // 找回密码
            else if (!res.data && page === 'reset') {
                return Promise.reject(`该${label}不存在`);
            }
            // 个人账号
            else if (res.data && page === 'account') {
                return Promise.reject(`该${label}已绑定账户，请更换${label}`);
            }
            // 成功 发送验证码
            else {
                if (time === 60 && !isSendEmailCode) {
                    setDisabled(false);
                }
                return Promise.resolve(res.data);
            }
        }
    }

    /**
     * 获取验证码
     */
    async function onVerifyingCode(type: string, receiver: string) {
        const res: any = await api.accountValidateCode({
            data: {
                validateType: type,
                receiver
            }
        });
        if (res.code === 'SUCCESS') {
            onTimer();
            message.success('验证码已发送');
        } else {
            message.error(res.message);
        }
    }

    return {
        timeText: time === 60 ? '发送验证码' : `${time}秒后重发`,
        disabled,
        setDisabled,
        onValidator,
        onVerifyingCode
    };
}

/**
 * 输入密码验证
 * @param password 密码
 * @param name 用户名
 */
export function validateToNextPassword(password: string, name: string) {
    if (!password) {
        return Promise.reject('密码不能为空');
    } else if ((password && !regExp.pass.test(password)) || password === name) {
        return Promise.reject(
            '6-32位字符，不与用户名相同，且字母、数字、符号至少含两种，区分大小写'
        );
    } else {
        return Promise.resolve();
    }
}

/**
 * 确认密码
 * @param password 密码
 * @param password2 确认密码
 * @param name 用户名
 * */
export function compareToFirstPassword(
    password: string,
    password2: string,
    name: string
) {
    if (!password2) {
        return Promise.reject('确认密码不能为空');
    } else if (
        (password2 && !regExp.pass.test(password2)) ||
        password === name
    ) {
        return Promise.reject(
            '6-32位字符，不与用户名相同，且字母、数字、符号至少含两种，区分大小写'
        );
    } else if (password2 && password2 !== password) {
        return Promise.reject('两次密码输入不一致');
    } else {
        return Promise.resolve();
    }
}
