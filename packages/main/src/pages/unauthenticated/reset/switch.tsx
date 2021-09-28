import styled from '@emotion/styled';
import { useState } from 'react';
import { calcSize } from 'utils';

let methods = [
    {
        name: 'telephone',
        title: '手机找回密码'
    },
    {
        name: 'email',
        title: '邮箱找回密码'
    }
];

interface Props {
    // 改变选中
    onChange: (name: 'telephone' | 'email') => void;
    current: number;
    // 更新组件
    callBack: () => void;
}
export default function CustomSwitch(props: Props) {
    const { current, callBack } = props;

    const [trasnLeft, setTrasnLeft] = useState(5);
    const switchClick = (item: any) => {
        if (current === 1) {
            return;
        }
        if (item.name === 'telephone') {
            setTrasnLeft(2);
        } else {
            setTrasnLeft(210);
        }
        callBack && callBack();
    };
    return (
        <>
            <Switch className="verification_method">
                {methods.map((item, index) => {
                    return (
                        <SwitchItem
                            key={index}
                            onClick={props.onChange.bind(
                                null,
                                item.name as 'telephone' | 'email'
                            )}
                        >
                            <div
                                className="fonts"
                                onClick={() => switchClick(item)}
                            >
                                {item.title}
                            </div>
                        </SwitchItem>
                    );
                })}
                <div
                    className="active"
                    style={{ left: `${calcSize(trasnLeft)}` }}
                ></div>
            </Switch>
        </>
    );
}

const SwitchItem = styled.div`
    width: ${calcSize(202)};
    height: ${calcSize(40)};
    line-height: ${calcSize(40)};
    text-align: center;
    color: #666;
    border-radius: ${calcSize(50)};
    font-size: ${calcSize(14)};
    cursor: pointer;
    position: relative;
    transition: left 0.3s;
`;

const Switch = styled.div`
    width: ${calcSize(416)};
    height: ${calcSize(48)};
    background-color: rgba(230, 247, 255, 0.42);
    border: 1px solid rgba(40, 120, 255, 0.08);
    border-radius: ${calcSize(50)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${calcSize(25)};
    position: relative;
    .active {
        width: ${calcSize(202)};
        height: ${calcSize(40)};
        line-height: ${calcSize(40)};
        text-align: center;
        color: #666;
        border-radius: ${calcSize(50)};
        font-size: ${calcSize(14)};
        cursor: pointer;
        position: absolute;
        top: 2px;
        left: 5px;
        background-color: rgb(255, 255, 255);
        box-shadow: rgb(216 235 255) 0px ${calcSize(8)} ${calcSize(16)} 0px;
        transition: left 0.5s ease 0s;
    }
    .fonts {
        z-index: 10;
        position: absolute;
        top: 0;
        width: ${calcSize(202)};
        text-align: center;
    }
`;
