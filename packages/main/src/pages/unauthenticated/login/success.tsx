import { Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styled from '@emotion/styled';
import { calcSize } from 'utils';

interface Props {
    // 用户名
    userName: string;
    // 密码
    password: string;
    //
    isFirstRegister: boolean;
    //跳转页面
    onEnterApp: () => void;
}

export default function ThirdPartRegisterSuccess(props: Props) {
    const { userName, password, isFirstRegister, onEnterApp } = props;

    if (isFirstRegister) {
        return (
            <div className="register_success">
                <Text>
                    <CheckCircleFilled
                        style={{ color: 'rgba(104,210,121)', fontSize: 50 }}
                    />
                    <p>恭喜您！注册成功！</p>
                </Text>
                <Content>
                    <div className="username">
                        <span className="lable">您的用户名为：</span>
                        <span>{userName}</span>
                    </div>
                    <div className="password">
                        <span className="lable">初始密码为：</span>
                        <span>{password} （默认手机号 8 位）</span>
                    </div>
                </Content>
                <Footer>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            margin: `${calcSize(28)} auto`,
                            width: calcSize(160),
                            padding: `0 ${calcSize(30)}`
                        }}
                        onClick={onEnterApp}
                    >
                        进入
                    </Button>
                </Footer>
            </div>
        );
    }
    return (
        <div className="register_success">
            <TextMargin>
                <CheckCircleFilled
                    style={{
                        color: 'rgba(104,210,121)',
                        fontSize: calcSize(50)
                    }}
                />
                <p>恭喜您！手机号绑定成功！</p>
            </TextMargin>

            <Footer>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                        width: calcSize(160),
                        padding: `0 ${calcSize(30)}`
                    }}
                    onClick={onEnterApp}
                >
                    进入
                </Button>
            </Footer>
        </div>
    );
}

const Text = styled.div`
    text-align: center;
    p {
        padding: ${calcSize(16)} 0 ${calcSize(20)};
        margin: 0;
    }
`;

const TextMargin = styled(Text)`
    margin-top: ${calcSize(74)};
`;

const Content = styled.div`
    border-radius: 4px;
    background-color: rgba(230, 247, 255, 0.42);
    color: rgba(16, 16, 16, 100);
    border: 1px solid rgba(40, 120, 255, 0.08);
    padding: ${calcSize(20)} ${calcSize(30)};
    .username {
        margin-bottom: ${calcSize(14)};
    }
    .lable {
        color: #666;
        font-size: ${calcSize(16)};
    }
    span {
        font-size: ${calcSize(16)};
        color: #101010;
    }
`;

const Footer = styled.div`
    text-align: center;
    margin-top: ${calcSize(7)};
`;
