import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { RuleObject } from 'antd/lib/form';
import { Icon } from 'components';
import {
    useValidator,
    receiverLabel,
    validateCodeLabel
} from 'hooks/unauthenticated';

import * as api from 'services';
import { calcSize } from 'utils';
import { useEffect } from 'react';
// import './input.less';

interface Props {
    type: 'telephone' | 'email';
    // 下一步
    next: (telephone?: string, name?: string) => void;
    // 设置用户名
    setName: any;
    // 更新
    update: string;
}

const iconClass = {
    telephone: 'iconshouji-01',
    email: 'iconyoujian-01'
};

export default function Account(props: Props) {
    const { type, next, setName, update } = props;
    const { timeText, disabled, onValidator, onVerifyingCode } = useValidator();
    const [form] = Form.useForm();

    //验证手机/邮箱
    const handleValidator = async (rule: RuleObject, value: any) => {
        try {
            const name = await onValidator(type, value, 'reset');
            setName(name);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    };

    //获取验证码
    const handleVerifyingCode = async () => {
        const receiver = form.getFieldValue('receiver');
        return onVerifyingCode(type, receiver);
    };

    //验证账号 下一步
    const onFinish = async (values: any) => {
        const res: any = await api.accountCheckValidateCode({
            data: values
        });
        if (!res.data) {
            form.setFields([
                {
                    name: ['validateCode'],
                    value: values.validateCode,
                    errors: [res.message]
                }
            ]);
        } else {
            next(values.receiver, res.data);
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [update]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <Form onFinish={onFinish} form={form} className="custom_form reset">
                <Form.Item
                    name="receiver"
                    rules={[
                        {
                            required: true,
                            validator: handleValidator
                        }
                    ]}
                >
                    <Input
                        id="lohover"
                        bordered={false}
                        placeholder={`请输入您的${receiverLabel[type]}`}
                        prefix={
                            <Icon
                                type={iconClass[type]}
                                style={{ fontSize: calcSize(24) }}
                            />
                        }
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
                                id="lohover"
                                bordered={false}
                                placeholder={`请输入您收到的${validateCodeLabel[type]}验证码`}
                                prefix={
                                    <Icon
                                        type="iconyanzhengma-01"
                                        style={{ fontSize: calcSize(24) }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={9}>
                            <Button
                                block
                                size="large"
                                type="primary"
                                disabled={disabled}
                                onClick={handleVerifyingCode}
                                style={{ width: calcSize(142), float: 'right' }}
                            >
                                {timeText}
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item
                    style={{ margin: `${calcSize(50)} 0 ${calcSize(42)} 0` }}
                >
                    <Button type="primary" htmlType="submit" size="large" block>
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
