import styled from 'styled-components';

export const WrapperHeaderUser = styled.div`
    display: flex;
    align-items: center;
    padding: 24px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
    font-size: 20px;
    font-weight: 600;
    color: #242424;
`;

export const WrapperStyleContent = styled.div`
    display: flex;
    background: #fff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
`;

export const WrapperInfoUser = styled.div`
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const WrapperLabel = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #242424;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
`;

export const WrapperContentInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: #242424;
        
        .info-icon {
            color: #999;
            width: 16px;
        }
    }

    .order-status {
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: currentColor;
        }
    }

    .delivery-info {
        font-size: 13px;
        color: #999;
        font-style: italic;
    }

    .status-payment {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${props => props.isPaid ? '#52c41a' : '#ff4d4f'};
        font-weight: 500;

        i {
            font-size: 16px;
        }
    }
`;

export const WrapperProduct = styled.div`
    .header-product {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        font-weight: 600;
        color: #242424;
    }

    .product-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        align-items: center;
    }
`;

export const WrapperAllPrice = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin: 8px 0;
    
    .label {
        font-size: 14px;
        color: #333;
    }
    
    .value {
        width: 200px;
        text-align: right;
        font-size: 14px;
        color: #333;
        
        &.total {
            color: #ff4d4f;
            font-size: 18px;
            font-weight: 500;
        }
    }
`;

export const WrapperItem = styled.div`
    font-size: 14px;
    color: #333;
`;

export const WrapperItemLabel = styled.div`
  width: 200px;
  text-align: right;
`

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
