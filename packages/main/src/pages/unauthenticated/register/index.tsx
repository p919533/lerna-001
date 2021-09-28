import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message, Checkbox } from 'antd';
import { RuleObject } from 'antd/lib/form';
import * as api from 'services';
import { useAsync } from 'hooks/use-async';
import styled from '@emotion/styled';
import {
    regExp,
    useValidator,
    validateToNextPassword,
    compareToFirstPassword
} from 'hooks/unauthenticated';
import { calcSize } from 'utils';
import Unauthenticated from '../index';
import * as H from 'history';
interface Props {
    history: H.History;
}

export default function RegisterPage(props: Props) {
    const [form] = Form.useForm();
    const { timeText, disabled, onValidator, onVerifyingCode } = useValidator();

    const { isLoading, run } = useAsync();

    /**
     * 验证用户名
     */
    const handleUserName = async (rule: RuleObject, value: string) => {
        if (/^[ ]*$/.test(value) || !value) {
            return Promise.reject('用户名不能为空');
        } else if (value && !regExp['user'].test(value)) {
            return Promise.reject(
                '6-24位字符，仅可含字母、数字、下划线，需以字母开头，区分大小写'
            );
        } else {
            //验证用户否存在
            const res: any = await api.accountCheck({
                params: {
                    checkType: 'name',
                    value
                }
            });
            if (res.message.indexOf('不存在') === -1) {
                return Promise.reject('该用户名已存在');
            }
            return Promise.resolve();
        }
    };

    /**
     * 输入密码验证
     */
    const handleValidateToNextPassword = (rule: RuleObject, password: any) => {
        const name = form.getFieldValue('name');
        return validateToNextPassword(password, name);
    };
    /**
     * 确认密码
     */
    const handleCompareToFirstPassword = (rule: RuleObject, password2: any) => {
        const name = form.getFieldValue('name');
        const password = form.getFieldValue('password');
        return compareToFirstPassword(password, password2, name);
    };

    /**
     * 验证手机 | 邮箱
     * @param type telephone  | email
     * @param value 值
     * */
    const handleValidator = async (type: string, value: string) => {
        return onValidator(type, value, 'register', type === 'email');
    };
    /**
     * 发送验证码
     * */
    const handleVerifyingCode = async () => {
        const receiver = form.getFieldValue('telephone');
        onVerifyingCode('telephone', receiver);
    };

    /**
     * 提交
     * */
    async function handleSubmit(values: { [key: string]: string }) {
        delete values['password2'];
        const res: any = await run(
            api.register({
                data: {
                    ...values
                }
            })
        );
        if (res.code === 'SUCCESS') {
            message.success('注册成功');
            setTimeout(() => {
                props.history.push('/login');
            }, 1000);
        } else if (res.code === 'CAPTCHA_EXPIRED_ERROR') {
            form.setFields([
                {
                    name: 'validateCode',
                    value: new Error(res.message)
                }
            ]);
        } else {
            message.error(res.message || '注册失败');
        }
    }
    return (
        <Unauthenticated
            title="用户注册"
            bottom={0.2}
            to={true}
            toTitle="已有账号，去登录"
        >
            <Container>
                <Form
                    onFinish={handleSubmit}
                    className="custom_form"
                    form={form}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                // required: true,
                                validator: handleUserName
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入用户名"
                            prefix={<IconRequired children={'*'} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                validator: handleValidateToNextPassword
                            }
                        ]}
                    >
                        <Input
                            type="password"
                            placeholder="请输入密码"
                            prefix={<IconRequired children={'*'} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password2"
                        rules={[
                            {
                                validator: handleCompareToFirstPassword
                            }
                        ]}
                    >
                        <Input
                            type="password"
                            placeholder="请再次输入密码"
                            prefix={<IconRequired children={'*'} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="telephone"
                        rules={[
                            {
                                required: true,
                                validator: async (
                                    rule: RuleObject,
                                    value: any
                                ) => {
                                    await handleValidator('telephone', value);
                                }
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入手机号"
                            prefix={<IconRequired children={'*'} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="validateCode"
                        rules={[
                            {
                                required: true,
                                message: '验证码不能为空'
                            }
                        ]}
                    >
                        <Row gutter={8}>
                            <Col span={15}>
                                <Input
                                    placeholder="请输入短信验证码"
                                    prefix={<IconRequired children={'*'} />}
                                />
                            </Col>
                            <Col span={9}>
                                <Button
                                    type="primary"
                                    disabled={disabled}
                                    size={'large'}
                                    style={{
                                        width: calcSize(142),
                                        float: 'right'
                                    }}
                                    onClick={handleVerifyingCode}
                                >
                                    {timeText}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    {/* <Form.Item name="fullName">
                        <Input
                            placeholder="请输入真实姓名"
                            prefix={<IconRequired children={''} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                validator: async (
                                    rule: RuleObject,
                                    value: any
                                ) => {
                                    await handleValidator('email', value);
                                }
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入邮箱"
                            prefix={<IconRequired children={''} />}
                        />
                    </Form.Item> */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            block
                            size="large"
                        >
                            立即注册
                        </Button>
                    </Form.Item>
                    <Form.Item
                        name="deal"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error('请阅读并同意')
                                          )
                            }
                        ]}
                    >
                        <Checkbox style={{ marginRight: 8 }}>
                            <span style={{ fontSize: calcSize(14) }}>
                                我已阅读并同意
                                <Link to="/deal" target="_blank">
                                    《盈嘉互联用户协议》
                                </Link>
                                <Link to="/privacy-clause" target="_blank">
                                    《隐私条款》
                                </Link>
                            </span>
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Container>
        </Unauthenticated>
    );
}

const IconRequired = styled.span`
    width: ${calcSize(16)};
    display: inline-block;
    font-size: ${calcSize(28)};
    height: ${calcSize(20)};
    line-height: ${calcSize(30)};
    color: #d95151;
    padding-left: ${calcSize(1)};
`;

const Container = styled.div`
    .ant-input-affix-wrapper {
        padding: ${calcSize(8)} ${calcSize(8)};
    }
`;
