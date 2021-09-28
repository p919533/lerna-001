import { useState } from 'react';
import { message } from 'antd';
import * as H from 'history';
import styled from '@emotion/styled';
import * as api from 'services';
import CustomSwitch from './switch';
import { Link } from 'react-router-dom';
import Account from './account';
import ResetPassword from './resetPassword';
import Complete from './complete';
import Unauthenticated from '../index';
import { calcSize, uuid } from 'utils';

// import './index.less';

const stepsList = [
    '第一步：选择对应的验证方式进行身份验证',
    '第二步：输入新密码并确认重置密码'
];

interface Props {
    history: H.History;
}

type Type = 'telephone' | 'email';

export default function Forgot(props: Props) {
    const [current, setCurrent] = useState(0);
    const [type, setType] = useState<Type>('telephone');
    const [receiver, setReceiver] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [update, setUpdate] = useState('');

    const next = (receiver?: string, newName: string = '') => {
        setReceiver(receiver);
        setCurrent(current + 1);
    };

    // const prev = () => {
    //     setCurrent(current - 1);
    // };

    const onPassword = async (values: any) => {
        const res: any = await api.accountSetPassword({
            data: {
                idenType: type,
                identifier: receiver,
                newPassword: values.password
            }
        });
        if (res.code === 'SUCCESS') {
            next();
            message.success('密码修改成功');
        } else {
            message.error(res.message);
        }
    };

    const onOpen = (path: string) => {
        props.history.push(`/${path}`);
    };

    function renderElement() {
        return [
            <Account
                type={type}
                next={next}
                setName={setName}
                update={update}
            />,
            <ResetPassword name={name} onPassword={onPassword} />,
            <Complete onOpen={onOpen} />
        ][current];
    }

    return (
        <Unauthenticated
            title="忘记密码"
            bottom={0.14}
            to={true}
            toTitle=" 返回登录"
        >
            <Container>
                <>
                    <div
                        style={{
                            marginBottom: calcSize(20),
                            fontSize: calcSize(16)
                        }}
                    >
                        {stepsList[current]}
                    </div>

                    <CustomSwitch
                        current={current}
                        onChange={(value: Type) => {
                            if (current === 0) {
                                setType(value);
                            }
                        }}
                        callBack={() => {
                            setUpdate(uuid());
                        }}
                    />
                    {renderElement()}
                </>
            </Container>
        </Unauthenticated>
    );
}

export const Container = styled.div`
    .ant-input-affix-wrapper {
        padding: ${calcSize(10)} ${calcSize(8)};
    }
`;
