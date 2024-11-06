import { Card } from 'antd';
import styled from 'styled-components';

export const StyleCard = styled(Card)`
    width: 200px;
    & img {
        width: 100%;
        object-fit: cover;
    },
    position: relative;
    background-color: ${(props) => (props.disabled ? '#ccc' : '#fff')};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const StyleImage = styled.img`
    top: -1px;
    left: -1px;
    position: absolute;
    height: 14px;
    width: 100%;
`;

export const StyleNameProduct = styled.div`
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    color: rgb(56, 56, 61);
    margin-bottom: 10px;
`;

export const StyleStart = styled.div`
    font-size: 12px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    font-weight: 500;
`;

export const StylePrice = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 500;
    margin: 6px 0 0;
`;

export const StyleDiscount = styled.span`
    color: rgb(255, 66, 78);
    font-size: 12px;
    font-weight: 500;
`;
