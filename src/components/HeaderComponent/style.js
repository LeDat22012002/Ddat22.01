import { Row } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: #333333;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 100%;
    padding: 10px 0;
    position: fixed;
    z-index: 10;
`;
export const WrapperHeader1 = styled(Row)`
    width: 1270px;
    padding: 10px 120px;
    background-color: #333333;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;

    padding: 10px 0;
`;

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #ffff;
    font-weight: 500;
    margin-left: 60px;
`;

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ffff;
`;

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #ffff;
    white-space: nowrap;
`;

export const WrapperHeaderIcon = styled.span`
    font-size: 30px;
`;

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    display: block;
    width: 100%;
    &:hover {
        color: rgb(26, 148, 255);
    }
`;
