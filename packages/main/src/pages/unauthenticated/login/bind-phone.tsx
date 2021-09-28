import { Button, message, Alert, Form, Input, Row, Col, Modal } from 'antd';
import * as api from 'services';
import cookie from 'react-cookies';
import styled from '@emotion/styled';
import { regExp, useTimer } from 'hooks/unauthenticated';
import { Icon } from 'components';
import { RuleObject } from 'antd/lib/form';
import { calcSize } from 'utils';

function checkUserFromWhere(userData: any) {
    if (userData.telephone) {
        let type = userData.telephone.substring(0, 2);
        let openId = userData.telephone.substring(2);
        return [type, openId];
    } else {
        return [];
    }
}

interface Props {
    userData: any;
    registerAndBindSuccess: (
        userData: any,
        registerIsPermitFlag: boolean
    ) => void;
    setDataBySuccess: (data: any) => void;
    onPhoneCode: () => void;
    // 登录成功跳转绑定
    // loginScuess: (type: any) => void;
}

export default function BindPhone(props: Props) {
    const { registerAndBindSuccess, setDataBySuccess, userData } = props;
    const [form] = Form.useForm();
    const { time, onTimer, disabled, setDisabled } = useTimer();

    //验证手机/邮箱
    const validator = async (rule: RuleObject, value: any) => {
        if (/^[ ]*$/.test(value) || !value) {
            return Promise.reject(`手机号不能为空`);
        } else if (!regExp['telephone'].test(value)) {
            return Promise.reject(`手机号格式错误`);
        } else {
            if (time === 60) {
                setDisabled(false);
            }
            return Promise.resolve();
        }
    };

    /**
     * 获取手机验证码
     */
    async function handleVerifyingCode() {
        // @ts-ignore
        let phone = form.getFieldValue('telephone');
        if (!/^1[3456789]\d{9}$/.test(phone) || phone === undefined) {
            return message.error('手机号码有误，请重填');
        } else {
            try {
                const data: any = await api.accountValidateCode({
                    data: {
                        validateType: 'telephone',
                        receiver: phone
                    }
                });

                if (data.code === 'SUCCESS') {
                    message.success('验证码发送成功');

                    // 获取60
                    onTimer();
                } else if (data.code === 'BUSINESS_LIMIT_CONTROL') {
                    message.error('过于频繁发送验证码，请稍后再试。');
                }
            } catch (err: any) {
                message.error(err.message || '第三方登录失败');
            }
        }
    }

    /**
     * 手机账号绑定新第三方账号
     * @returns
     */
    const handleClickLoginByThirdPart = async (values: any) => {
        if (values.validateCode === '') {
            return message.error('请获取验证码, 并且正确填入验证码');
        }

        try {
            //检查手机号没有被使用过
            const res: any = await api.accountCheck({
                params: {
                    checkType: 'telephone',
                    value: values.telephone
                }
            });
            if (res.data === null) {
                // 说明手机号没有被使用过, 是首次注册用户
                confirmBindNewThirdPart(values.validateCode, true);
            } else {
                let [type] = checkUserFromWhere(userData);
                //检查手机号之前是否绑定过第三方账号
                const data = await api.checkPhoneBindThird({
                    params: {
                        type,
                        appKey: window.bosapp.appKey,
                        telephone: values.telephone
                    }
                });

                if (data) {
                    // 展示 modal, 让用户选择是否重新绑定
                    Modal.confirm({
                        centered: true,
                        title: '该手机号已经绑定其他微信/QQ号, 是否重新绑定?',
                        content: null,
                        okText: '确定',
                        cancelText: '取消',
                        onCancel: cancelBindNewThirdPart,
                        onOk: () => {
                            confirmBindNewThirdPart(values.validateCode, false);
                        }
                    });
                } else {
                    confirmBindNewThirdPart(values.validateCode, false);
                }
            }
        } catch (err: any) {
            message.error(err.message || '服务器错误');
        }
    };

    // 当用户取消绑定新第三方账号
    const cancelBindNewThirdPart = () => {};

    /**
     * 当用户确定绑定新第三方账号
     * @param {*} phoneCode 手机验证码
     * @param {*} tempIsFirstRegisterFlag 是否首次注册
     */
    const confirmBindNewThirdPart = async (
        phoneCode: string,
        tempIsFirstRegisterFlag: boolean
    ) => {
        let type = checkUserFromWhere(userData)[0];
        let postData: any = {
            data: {
                telephone: form.getFieldValue('telephone'),
                type: type,
                validateCode: phoneCode
            }
        };
        if (type === 'wx') {
            type = userData.wxUUID.split('※')[2];
            if (type === 'wxOpen') {
                postData.data.unionId = userData.wxUnionID;
            } else {
                postData.data.openId = userData.wxOpenID;
            }
        } else {
            type = userData.qqUUID.split('※')[2];
            if (type === 'qqOpen') {
                postData.data.unionId = userData.qqUnionID;
            } else {
                postData.data.openId = userData.qqOpenID;
            }
        }

        try {
            let data: any = await api.thirdUpdateUser(postData);

            /**
             * true 表示通过审核, false 表示未通过审核
             */
            let registerIsPermit = true;

            if (
                Object.keys(data).includes('errorCode') &&
                data.errorCode === 'USER_NOT_PERMIT'
            ) {
                registerIsPermit = false;
            }

            // 检查注册的用户是否通过需要通过审核
            if (registerIsPermit) {
                // 说明手机号没有被使用过, 是首次注册用户
                if (tempIsFirstRegisterFlag) {
                    cookie.save('accessToken', data.access_token, {
                        path: '/'
                    });
                    registerAndBindSuccess(data, true);
                } else {
                    setDataBySuccess(data);
                }
            } else {
                // registerIsPermitFlag.current = false;
                registerAndBindSuccess(data, false);
            }
        } catch (err: any) {
            message.error(err.message || '服务器错误');
        }
    };

    return (
        <div className="bind_phone">
            <div className="bind_phone_header">
                <Alert
                    showIcon
                    message="微信 / QQ 账号授权成功"
                    type="success"
                />
            </div>
            <Description>
                请绑定手机号, 如为新用户, 验证成功后该手机将注册为您的账号
            </Description>
            <div className="bind-phone-form">
                <Form
                    form={form}
                    className="custom_form"
                    onFinish={handleClickLoginByThirdPart}
                >
                    <Form.Item
                        name="telephone"
                        rules={[
                            {
                                required: true,
                                validator
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入手机号"
                            size="large"
                            prefix={<Icon type="iconshouji-01" />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="validateCode"
                        rules={[
                            {
                                required: true,
                                message: '验证码不能为空!'
                            }
                        ]}
                    >
                        <Row gutter={8}>
                            <Col span={15}>
                                <Input
                                    size="large"
                                    placeholder={`请输入短信验证码`}
                                    prefix={<Icon type="iconyanzhengma-01" />}
                                />
                            </Col>
                            <Col span={9}>
                                <Button
                                    block
                                    type="primary"
                                    size="large"
                                    disabled={disabled}
                                    onClick={handleVerifyingCode}
                                    style={{
                                        width: calcSize(142),
                                        float: 'right'
                                    }}
                                >
                                    {time === 60
                                        ? '发送验证码'
                                        : `${time}秒后重发`}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

const Description = styled.div`
    color: #666;
    font-size: ${calcSize(14)};
    margin: ${calcSize(8)} 0px ${calcSize(20)} 0;
`;
