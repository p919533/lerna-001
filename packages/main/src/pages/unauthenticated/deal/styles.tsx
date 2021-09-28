import styled from '@emotion/styled';
import logo from 'assets/logo_grey.png';

export const Container = styled.div`
    width: 100%;
    background: #f4f4f4;
    .main {
        margin: 0px 90px;
        .dealHead {
            height: 92px;
            position: relative;
            .log {
                width: 9rem;
                height: 2.75rem;
                position: absolute;
                left: 0;
                top: 29px;
                background: url(${logo}) no-repeat;
                background-size: 100% 100%;
            }
            .title {
                width: 100%;
                height: 84px;
                text-align: center;
                line-height: 84px;
                font-size: 24px;
                color: #000;
            }
        }
        .dealContant {
            > p {
                line-height: 40px;
            }
            .level1 {
                font-size: 20px;
                color: #282828;
            }
            .level2 {
                font-size: 16px;
                color: #474747;
            }
            .level3 {
                font-size: 16px;
                color: #474747;
            }
        }
    }
`;
