import { Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Icon } from 'components';
import { calcSize } from 'utils';

interface Props {
    onOpen: (path: string) => void;
}
export default function Complete(props: Props) {
    return (
        <Container>
            <CheckCircleFilled
                style={{ color: 'rgba(104,210,121)', fontSize: 50 }}
            />
            <div className="text">
                {/* <img src={resetCheck} style={{ marginRight: 16 }} /> */}
                密码重置成功！点击下方按钮可立即返回登录
            </div>
            <Button
                type="primary"
                htmlType="submit"
                icon={
                    <Icon
                        type="iconfanhuijiantou-01"
                        style={{
                            color: '#FFF',
                            marginRight: 5
                        }}
                    />
                }
                style={{
                    margin: `${calcSize(28)} auto 0 `,
                    padding: `0 ${calcSize(30)}`
                }}
                onClick={props.onOpen.bind(null, 'login')}
            >
                返回登录
            </Button>
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    text-align: center;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    padding-top: ${calcSize(140)};
    z-index: 99;
    .text {
        font-size: ${calcSize(16)};
        height: ${calcSize(48)};
        line-height: ${calcSize(48)};
    }
`;
