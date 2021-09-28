import { Link } from 'react-router-dom';
import { Container, MainCenter, MainBorder, Content, Title } from './styles';
import DocumentComponent from 'bos-document';
// const bosComp = require('bos-comp');
// console.log('bosComp===', bosComp(1, 2));

// console.log('Document===', DocumentComponent);

interface Props {
    // 子节点
    children: any | undefined;
    // 标题
    title: string;
    // 跳转
    to?: boolean;
    // 跳转文案
    toTitle?: string;
    //文字边距
    bottom?: number;
}

export default function Unauthenticated(props: Props) {
    const { title, to, bottom, toTitle = '' } = props;
    return (
        <Container>
            <div className="werwewe">
                <DocumentComponent />
                {/* {DocumentComponent()} */}
            </div>
            <MainCenter between={'center'}>
                <MainBorder>
                    <Content>
                        <Title bottom={bottom}>
                            <h3>{title}</h3>
                            {to && <Link to={'/login'}>{toTitle}&gt;</Link>}
                        </Title>
                        {props.children}
                    </Content>
                </MainBorder>
            </MainCenter>
        </Container>
    );
}
