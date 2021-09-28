import styled from '@emotion/styled';
import { FlexCenter } from 'components';

export const Content = styled.div`
    width: 4.4rem;
    background: #fff;
    padding: 0.4rem 0.4rem 0;
    position: relative;
    border-radius: 0.08rem;
    overflow: hidden;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const MainBorder = styled.div`
    padding: 0.08rem;
    border-radius: 0.12rem;
    background-size: cover;
    background-color: rgba(185, 230, 255, 0.25);
    line-height: 0.2rem;
`;

export const MainCenter = styled(FlexCenter)`
    justify-content: space-between;
`;

export const Container = styled.div`
    width: 14rem;
    margin: 0px auto;
    min-height: calc(100vh - 140px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ant-input-affix-wrapper {
        border: none;
        padding: 0.1rem 0.08rem;
        border-bottom: 1px solid #dcdcdc;
    }
    .ant-input {
        font-size: 0.16rem;
    }
`;

export const Title = styled.div<{
    bottom?: number;
}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) =>
        props.bottom ? props.bottom + 'rem' : '0.3rem'};
    h3 {
        font-size: 0.22rem;
        margin: 0px;
    }
`;
