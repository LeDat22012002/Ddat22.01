import styled from 'styled-components';

export const WrapperHeaderUser = styled.div`
    display: flex;
    justifycontent: space-between;
    width: 100%;
`;
export const WrapperInfoUser = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;
export const WrapperLabel = styled.label`
    font-size: 18px;
    font-weight: 500;
`;
export const WrapperContentInfo = styled.div`
    background-color: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
    margin-top: 10px;
    border-radius: 4px solid #f5f5f5;
    height: 90px;
`;
export const WrapperStyleContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
`;
export const WrapperItemLabel = styled.div`
    width: 200px;
    font-size: 16px;
    font-weight: 400;
    margin-right: 10px;
`;
export const WrapperProduct = styled.div`
    display: flex;
    // justify-content: space-between;
    align-items: center;
    margin-right: 10px;
`;
export const WrapperNameProduct = styled.div`
    width: 400px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
`;
export const WrapperItem = styled.div`
    width: 200px;
    font-weight: bold;
    font-size: 15px;
    margin-right: 30px;

    &.last-child {
        color: red;
    }
`;

export const WrapperAllPrice = styled.div`
    display: flex,
    flex-direction:column;
    align-items: flex-end;
`;
