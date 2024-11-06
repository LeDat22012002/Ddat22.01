import { Col, Row, Image, Rate } from 'antd';
// import product1 from '../../accsets/image/product1.webp';
import product1small from '../../accsets/image/guita1.jpg';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {
    StyleAddressProduct,
    StyleDesProduct,
    StyleImageDetails,
    StyleImageSmall,
    StyleImageSmallProduct,
    StyleInputNumber,
    StyleNameProduct,
    StylePriceProduct,
    StylePriceTextProduct,
    StyleQuantityProduct,
    StyleTextSell,
} from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from 'react-query';
import Loading from '../LoadingComponent/Loading';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import * as message from '../MessageComponent/Message';

const ProductDetailComponent = ({ idProduct }) => {
    // dùng để trỏ đến các trang khác
    const navigate = useNavigate();
    const localtion = useLocation();
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const [errorLimitOrder, setErrorLimitOrder] = useState(false);
    const [numProduct, setNumProduct] = useState(1);
    const user = useSelector((state) => state.user);
    // Gọi API
    const fetchgetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailsProduct(id);
            return res.data;
        }
    };

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id);
        if (
            orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
            (!orderRedux && productDetails?.countInStock > 0)
        ) {
            setErrorLimitOrder(false);
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true);
        }
    }, [numProduct]);

    useEffect(() => {
        if (order?.isSuccessOrder) {
            message.success('Đã thêm vào giỏ hàng');
        }

        return () => {
            dispatch(resetOrder());
        };
    }, [order.isSuccessOrder]);

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchgetDetailsProduct, {
        enabled: !!idProduct,
    });
    // console.log(' productDetails', productDetails);

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1);
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1);
            }
        }
    };
    const onChange = (e) => {
        setNumProduct(Number(e.target.value));
    };

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: localtion?.pathname });
        } else {
            // navigate('/orders');
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id);
            if (
                orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
                (!orderRedux && productDetails?.countInStock > 0)
            ) {
                dispatch(
                    addOrderProduct({
                        orderItem: {
                            name: productDetails?.name,
                            amount: numProduct,
                            image: productDetails?.image,
                            price: productDetails?.price,
                            product: productDetails?._id,
                            discount: productDetails?.discount,
                            countInstock: productDetails?.countInStock,
                        },
                    }),
                );
            } else {
                setErrorLimitOrder(true);
            }
            // console.log('datngu', orderRedux);
        }
    };
    // console.log('productDetails', productDetails, user);
    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', backgroundColor: '#ffff', borderRadius: '4px' }}>
                <StyleImageDetails span={10}>
                    <Image
                        style={{ borderRadius: '5px' }}
                        src={productDetails?.image}
                        alt="product_1"
                        preview={false}
                    ></Image>
                    <Row style={{ margin: '10px 0 0 15px', display: 'flex' }}>
                        <StyleImageSmallProduct span={4}>
                            <StyleImageSmall src={product1small} alt="product_1" preview={false}></StyleImageSmall>
                        </StyleImageSmallProduct>
                        <StyleImageSmallProduct span={4}>
                            <StyleImageSmall src={product1small} alt="product_1" preview={false}></StyleImageSmall>
                        </StyleImageSmallProduct>
                        <StyleImageSmallProduct span={4}>
                            <StyleImageSmall src={product1small} alt="product_1" preview={false}></StyleImageSmall>
                        </StyleImageSmallProduct>
                        <StyleImageSmallProduct span={4}>
                            <StyleImageSmall src={product1small} alt="product_1" preview={false}></StyleImageSmall>
                        </StyleImageSmallProduct>
                        <StyleImageSmallProduct span={4}>
                            <StyleImageSmall src={product1small} alt="product_1" preview={false}></StyleImageSmall>
                        </StyleImageSmallProduct>
                    </Row>
                </StyleImageDetails>
                <Col style={{ paddingLeft: '10px' }} span={14}>
                    <StyleNameProduct>{productDetails?.name}</StyleNameProduct>
                    <StyleNameProduct>Loại Đàn: {productDetails?.type}</StyleNameProduct>
                    <StyleNameProduct>Thương hiệu: Taylor</StyleNameProduct>
                    <StyleNameProduct>Số lượng: {productDetails?.countInStock}</StyleNameProduct>
                    <div>
                        <Rate allowHalf value={productDetails?.rating} />
                        <StyleTextSell> | Đã bán: {productDetails?.selled}</StyleTextSell>
                    </div>
                    <StylePriceProduct>
                        <StylePriceTextProduct>{convertPrice(productDetails?.price)}</StylePriceTextProduct>
                    </StylePriceProduct>

                    <StyleAddressProduct>
                        <span>Giao đến </span>
                        <span className="address">{user?.address}</span> -
                        <span className="changeaddress"> Đổi địa chỉ</span>
                    </StyleAddressProduct>
                    <div
                        style={{
                            margin: '10px 0 20px',
                            padding: '10px 0',
                            borderTop: '1px solid #e5e5e5',
                            borderBottom: '1px solid #e5e5e5',
                        }}
                    >
                        <div style={{ margin: '0 0 10px' }}>Số lượng</div>
                        <StyleQuantityProduct>
                            <button
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                onClick={() => handleChangeCount('decrease', numProduct === 1)}
                            >
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }}></MinusOutlined>
                            </button>

                            <StyleInputNumber
                                size="small"
                                // defaultValue={1}
                                value={numProduct}
                                onChange={onChange}
                                min={1}
                                max={productDetails?.countInStock}
                            ></StyleInputNumber>

                            <button
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                onClick={() =>
                                    handleChangeCount('increase', numProduct === productDetails?.countInStock)
                                }
                            >
                                <PlusOutlined
                                    style={{
                                        color: '#000',
                                        fontSize: '20px',
                                    }}
                                ></PlusOutlined>
                            </button>
                        </StyleQuantityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                        <div>
                            <ButtonComponent
                                style={{
                                    backgroundColor: '#fff',
                                }}
                                onClick={handleAddOrderProduct}
                                textButton={'Thêm vào giỏ hàng'}
                            ></ButtonComponent>
                            {errorLimitOrder && (
                                <div style={{ color: 'red', fontSize: '14px' }}>Sản phẩm đã hết hàng</div>
                            )}
                        </div>
                    </div>
                </Col>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    Mô tả chỉ tiết sản phẩm
                    <StyleDesProduct>{productDetails?.description}</StyleDesProduct>
                </div>
            </Row>
        </Loading>
    );
};

export default ProductDetailComponent;
