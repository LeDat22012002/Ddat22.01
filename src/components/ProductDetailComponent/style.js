import styled from 'styled-components';
import { Col, Image, InputNumber } from 'antd';

export const StyleImageDetails = styled(Col)`
    background-color: #ffff;
    padding: 20px 25px 20px 10px;
    text-align: center;
    border-right: 1px solid #e5e5e5;
`;

export const StyleImageProduct = styled(Image)`
    width: 100%;
    object-fit: cover;
    margin-left: 10px;
`;

export const StyleImageSmall = styled(Image)`
    height: 100px;
    width: 100px;
`;

export const StyleImageSmallProduct = styled(Col)`
    border: 1px solid #ccc;
    margin: 5px;
`;

// bên tjoong tin sản phẩm :

export const StyleNameProduct = styled.h3`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
    word-break: break-word;
    border-bottom: 1px solid #e5e5e5;
`;

export const StyleDesProduct = styled.div`
    color: rgb(36, 36, 36);
    font-size: 16px;
    font-weight: 400;
    line-height: 36px;
    word-break: break-word;
`;

export const StyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`;
export const StylePriceProduct = styled.div`
    background-color: rgb(250, 250, 250);
    border-radius: 4px;
`;

export const StylePriceTextProduct = styled.h1`
    font-size: 30px;
    line-height: 40px;
    font-weight: 500;
    margin-right: 8px;
    padding: 10px;
    margin-top: 10px;
`;

export const StyleAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl;
    }
    span.changeaddress {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`;

export const StyleQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 120px;
    margin-bottom: 10px;
`;

export const StyleInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        border-radius: none;
        .ant-input-number-handler-wrap {
            display: none !important ;
        }
    }
`;
