import { Button, Form, Input, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { calcSize } from 'utils';
import { FlexCenter, Icon } from 'components';
import { useEffect } from 'react';

export interface SubmitValues {
    name: string;
    password: string;
    isRemember: boolean;
}

interface Props {
    onSubmit: (vulues: SubmitValues) => void;
    tabLogin: (type: string) => void;
    itemChange: (value: any) => void;
    defaultCheck: any;
}

export default function DefalutLogin(props: Props) {
    const { onSubmit, tabLogin, itemChange, defaultCheck } = props;

    return (
        <Container>
            <Form onFinish={onSubmit} className="custom_form">
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: '请输入用户名/手机号' }]}
                >
                    <Input
                        prefix={<Icon type="iconyonghuzhanghao-01" />}
                        placeholder="请输入用户名/手机号"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<Icon type="iconmima-01" />}
                        placeholder="请输入密码"
                        iconRender={(visible) => (
                            <Icon
                                type={
                                    visible
                                        ? 'iconicon_notvisible'
                                        : 'iconicon_visible'
                                }
                                style={{
                                    color: '#999'
                                }}
                            />
                        )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">
                        登录
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Checkbox
                        onChange={itemChange}
                        defaultChecked={defaultCheck}
                    >
                        一周内自动登录
                    </Checkbox>
                    <Link to="/register" style={{ float: 'right' }}>
                        免费注册&gt;
                    </Link>
                </Form.Item>
            </Form>
            <OtherLogin between="space-between">
                <FlexCenter>
                    <div className="text">其他登录方式</div>
                    <span
                        onClick={tabLogin.bind(null, 'wxOpen')}
                        className="weixin"
                    >
                        <Icon
                            type="iconicon_weixin"
                            color={'#86E1AD'}
                            style={{ fontSize: '0.2rem' }}
                        />
                    </span>
                    <span onClick={tabLogin.bind(null, 'qq')} className="qq">
                        <Icon
                            type="iconicon_QQ"
                            color={'#A6D6F2'}
                            style={{ fontSize: '0.2rem' }}
                        />
                    </span>
                </FlexCenter>
                <Link
                    to="/reset"
                    style={{
                        float: 'left'
                    }}
                    className="forgetHover"
                >
                    忘记密码？
                </Link>
            </OtherLogin>
        </Container>
    );
}

const Container = styled.div`
    .forgetHover {
        color: #666;
    }
    .forgetHover:hover {
        color: #2878ff;
    }
    /* .ant-form-item {
        margin-bottom: ${calcSize(36)};
    } */
    /* 错误提示 */
    /* .ant-form-item-with-help {
        margin-bottom: 0;
    } */
    /* 提示语高度 */
    /* .ant-form-item-explain {
        min-height: ${calcSize(36)};
        line-height: ${calcSize(36)};
    }
    .ant-input-affix-wrapper {
        border: none;
        padding: ${calcSize(8)} ${calcSize(11)};
        border-bottom: 1px solid #dcdcdc;
    }
    .ant-checkbox + span {
        font-size: ${calcSize(16)};
        color: #666;
    } */
`;

/**
 * 第三方登录
 * */
const OtherLogin = styled(FlexCenter)`
    margin: ${calcSize(34)} ${calcSize(-40)} 0;
    background: #e8f3ff;
    height: ${calcSize(80)};
    justify-content: space-around;
    .text {
        color: #666;
        padding-right: ${calcSize(30)};
        border-right: 1px solid #d3d3d3;
        margin-right: ${calcSize(20)};
        font-size: ${calcSize(16)};
    }
    span {
        width: ${calcSize(24)};
        margin: 0px ${calcSize(10)};
        cursor: pointer;
    }
    .weixin > div > span > svg:hover {
        color: rgb(78, 210, 101);
    }
    .qq > div > span > svg:hover {
        color: rgb(93, 188, 255);
    }
`;
