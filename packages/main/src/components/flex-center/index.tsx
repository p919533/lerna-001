import styled from '@emotion/styled';

export const FlexCenter = styled.div<{
    between?: string;
}>`
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.between ? props.between : undefined)};
    > * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
    }
`;
