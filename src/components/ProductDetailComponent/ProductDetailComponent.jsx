import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Col, Row, Image, Rate } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import * as message from '../MessageComponent/Message';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Loading from '../LoadingComponent/Loading';
import {
    StyleAddressProduct,
    StyleDesProduct,
    StyleImageDetails,
    StyleInputNumber,
    StyleNameProduct,
    StylePriceProduct,
    StylePriceTextProduct,
    StyleQuantityProduct,
    StyleTextSell,
} from './style';

// Components
const ProductImage = ({ image, name }) => (
    <StyleImageDetails span={10}>
        <Image
            style={{ borderRadius: '5px' }}
            src={image}
            alt={name}
            preview={false}
        />
    </StyleImageDetails>
);

const ProductBasicInfo = ({ product }) => (
    <>
        <StyleNameProduct>{product?.name}</StyleNameProduct>
        <StyleNameProduct>Danh mục: {product?.category?.name}</StyleNameProduct>
        <StyleNameProduct>Dáng đàn: {product?.type}</StyleNameProduct>
        <StyleNameProduct>Thương hiệu: {product?.brand?.name}</StyleNameProduct>
        <StyleNameProduct>Số lượng trong kho: {product?.countInStock}</StyleNameProduct>
    </>
);

const RatingAndSales = ({ rating, selled }) => (
    <div>
        <Rate allowHalf value={rating} />
        <StyleTextSell>
            | Đã bán: <span style={{ fontWeight: '600' }}>{selled}</span>
        </StyleTextSell>
    </div>
);

const DeliveryAddress = ({ address }) => (
    <StyleAddressProduct>
        <span>Giao đến </span>
        <span className="address">{address}</span> -
        <span className="changeaddress"> Đổi địa chỉ</span>
    </StyleAddressProduct>
);

const QuantityInput = ({ 
    quantity, 
    availableStock, 
    isOverLimit, 
    onIncrease, 
    onDecrease, 
    onChange 
}) => (
    <div style={{ margin: '10px 0 20px' }}>
        <div>Số lượng</div>
        <StyleQuantityProduct>
            <button
                onClick={onDecrease}
                disabled={quantity <= 1}
                style={{ cursor: quantity <= 1 ? 'not-allowed' : 'pointer' }}
            >
                <MinusOutlined />
            </button>

            <StyleInputNumber
                min={1}
                max={availableStock}
                value={quantity}
                onChange={onChange}
                type="number"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />

            <button
                onClick={onIncrease}
                disabled={isOverLimit}
                style={{ cursor: isOverLimit ? 'not-allowed' : 'pointer' }}
            >
                <PlusOutlined />
            </button>
        </StyleQuantityProduct>

        {isOverLimit && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                Số lượng vượt quá số lượng còn lại trong kho
            </div>
        )}
    </div>
);

const AddToCartButton = ({ isOverLimit, quantity, onClick }) => (
    <ButtonComponent
        onClick={onClick}
        disabled={isOverLimit || quantity < 1}
        style={{
            backgroundColor: (isOverLimit || quantity < 1) ? '#ccc' : 'rgb(255,57,69)',
            color: '#fff',
        }}
        textButton={isOverLimit ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
    />
);

// Custom hooks
const useProductStock = (productDetails, orderItems) => {
    const currentCartItem = useMemo(() => {
        return orderItems?.find(item => item.product === productDetails?._id);
    }, [orderItems, productDetails]);

    const availableStock = useMemo(() => {
        return (productDetails?.countInStock || 0) - (currentCartItem?.amount || 0);
    }, [productDetails, currentCartItem]);

    return { currentCartItem, availableStock };
};

const useQuantityControl = (availableStock) => {
    const [quantity, setQuantity] = useState(1);
    const [isOverLimit, setIsOverLimit] = useState(false);

    const validateAndSetQuantity = (newValue) => {
        // Đảm bảo giá trị trong khoảng hợp lệ
        if (newValue > availableStock) {
            setQuantity(availableStock);
            setIsOverLimit(true);
            message.error('Số lượng không thể vượt quá số lượng trong kho!');
            return;
        }
        if (newValue < 1) {
            setQuantity(1);
            setIsOverLimit(false);
            return;
        }
        setQuantity(newValue);
        setIsOverLimit(false);
    };

    const handleIncrease = () => {
        if (quantity < availableStock) {
            validateAndSetQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            validateAndSetQuantity(quantity - 1);
        }
    };

    // Antd Input.Number trả về giá trị trực tiếp, không phải event
    const handleChange = (value) => {
        // Nếu input rỗng hoặc không phải số
        if (!value || isNaN(value)) {
            setQuantity(1);
            setIsOverLimit(false);
            return;
        }

        validateAndSetQuantity(Number(value));
    };

    return {
        quantity,
        isOverLimit,
        handleIncrease,
        handleDecrease,
        handleChange
    };
};

// Main component
const ProductDetailComponent = ({ idProduct }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);

    const { isLoading, data: productDetails } = useQuery(
        ['product-details', idProduct], 
        () => ProductService.getDetailsProduct(idProduct).then(res => res.data),
        { enabled: !!idProduct }
    );

    const { availableStock } = useProductStock(productDetails, order?.orderItems);
    const { 
        quantity, 
        isOverLimit, 
        handleIncrease, 
        handleDecrease, 
        handleChange 
    } = useQuantityControl(availableStock);

    useEffect(() => {
        if (order?.isSuccessOrder) {
            message.success('Đã thêm vào giỏ hàng');
            return () => dispatch(resetOrder());
        }
    }, [order?.isSuccessOrder, dispatch]);

    const handleAddToCart = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname });
            return;
        }

        if (quantity > 0 && quantity <= availableStock) {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: quantity,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInstock: productDetails?.countInStock,
                }
            }));
        }
    };

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '4px' }}>
                <ProductImage image={productDetails?.image} name={productDetails?.name} />

                <Col style={{ paddingLeft: '10px' }} span={14}>
                    <ProductBasicInfo product={productDetails} />
                    <RatingAndSales rating={productDetails?.rating} selled={productDetails?.selled} />

                    <StylePriceProduct>
                        <StylePriceTextProduct>
                            {convertPrice(productDetails?.price)}
                        </StylePriceTextProduct>
                    </StylePriceProduct>

                    <DeliveryAddress address={user?.address} />

                    <QuantityInput
                        quantity={quantity}
                        availableStock={availableStock}
                        isOverLimit={isOverLimit}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onChange={handleChange}
                    />

                    <AddToCartButton
                        isOverLimit={isOverLimit}
                        quantity={quantity}
                        onClick={handleAddToCart}
                    />
                </Col>

                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', width: '100%' }}>
                    Mô tả chi tiết sản phẩm
                    <StyleDesProduct>{productDetails?.description}</StyleDesProduct>
                </div>
            </Row>
        </Loading>
    );
};

export default ProductDetailComponent;