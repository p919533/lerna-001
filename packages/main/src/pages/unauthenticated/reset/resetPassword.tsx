import React from 'react';
import { Form, Input, Button } from 'antd';
import { RuleObject } from 'antd/lib/form';
import {
    validateToNextPassword,
    compareToFirstPassword
} from 'hooks/unauthenticated';
import { calcSize } from 'utils';

interface Props {
    // 用户名
    name: string;
    // 修改密码
    onPassword: (name: string) => void;
}
export default function ResetPassword(props: Props) {
    const { name, onPassword } = props;
    const [form] = Form.useForm();

    //输入密码验证
    function handleValidateToNextPassword(rule: RuleObject, password: string) {
        return validateToNextPassword(password, name);
    }
    //确认密码
    const handleCompareToFirstPassword = (
        rule: RuleObject,
        password2: string
    ) => {
        const password = form.getFieldValue('password');
        return compareToFirstPassword(password, password2, name);
    };

    const onFinish = (values: string) => {
        onPassword(values);
    };

    return (
        <Form onFinish={onFinish} form={form} className="custom_form">
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        validator: handleValidateToNextPassword
                    }
                ]}
            >
                <Input
                    type="password"
                    placeholder="请输入新密码"
                    prefix={<></>}
                />
            </Form.Item>

            <Form.Item
                name="password2"
                rules={[
                    {
                        required: true,
                        validator: handleCompareToFirstPassword
                    }
                ]}
            >
                <Input
                    type="password"
                    placeholder="请再次确认新密码"
                    prefix={<></>}
                />
            </Form.Item>
            <Form.Item style={{ marginTop: calcSize(50) }}>
                <Button type="primary" htmlType="submit" size="large" block>
                    下一步
                </Button>
            </Form.Item>
        </Form>
    );
}
