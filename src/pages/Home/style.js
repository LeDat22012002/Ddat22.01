import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Col } from 'antd';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    font-size: 14px;
    backgroundcolor: #ffdd00;
    height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        background-color: rgb(13, 92, 182);
        color: #ffff;
        span {
            color: #ffff;
        }
    }
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointers')};
`;

export const WrapperProducts = styled.div`
    display: flex;
    gap: 17px;
    margin-top: 20px;
    flex-wrap: wrap;
`;

export const WrapperNavbar = styled(Col)`
    background-color: #fff;
    margin-right: 10px;
    padding: 10px;
    border-radius: 6px;
    height: fit-content;
    margin-top: 20px;
    width: 200px;
`;
