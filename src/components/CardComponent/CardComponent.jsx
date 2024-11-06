import { useNavigate } from 'react-router-dom';
import { StyleCard, StyleDiscount, StyleNameProduct, StylePrice, StyleStart } from './style';
import { StarFilled } from '@ant-design/icons';
import { convertPrice } from '../../utils';
// import product from '../../accsets/image/guita1.jpg';

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, selled, discount, id } = props;
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-detail/${id}`);
    };
    return (
        <StyleCard
            hoverable
            style={{ width: '240px' }}
            cover={<img style={{ width: '100%' }} alt="ảnh product" src={image} />}
            onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <StyleStart>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <span> | Đã bán {selled || 30}</span>
            </StyleStart>
            <StylePrice>
                <span style={{ marginRight: '5px' }}>{convertPrice(price)}</span>
                <StyleDiscount>-{discount || 5} %</StyleDiscount>
            </StylePrice>
        </StyleCard>
    );
};

export default CardComponent;
