import { useLocation, useParams } from 'react-router-dom';
import {
    WrapperAllPrice,
    WrapperContentInfo,
    WrapperHeaderUser,
    WrapperInfoUser,
    WrapperItem,
    WrapperItemLabel,
    WrapperLabel,
    WrapperNameProduct,
    WrapperProduct,
    WrapperStyleContent,
} from './style';
import { useMemo } from 'react';
import * as OrderService from '../../services/OrderService';
import { useQuery } from 'react-query';
import { orderContant } from '../../Containt';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';

const DetailsOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const params = useParams();
    const { id } = params;
    // console.log('params', params);
    //access_token
    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token);
        // console.log('res', res);
        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['orders-details'], queryFn: fetchDetailsOrder },
        {
            enabled: id,
        },
    );
    const { isLoading, data } = queryOrder;
    // console.log('datadat', data);
    // const {
    //     shippingAddress = '',
    //     orderItems = [],
    //     shippingPrice = '',
    //     paymentMethod = '',
    //     isPaid = false,
    //     totalPrice = '',
    // } = data;
    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [data]);

    return (
        <Loading isLoading={isLoading}>
            <div style={{ width: '100%', backgroundColor: '#f5f5fa' }}>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <h4
                        style={{
                            marginTop: '1px',
                            paddingTop: '20px',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                    >
                        Chi tiết đơn hàng
                    </h4>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                            <WrapperContentInfo>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="name-info"
                                >
                                    Tên: {data?.shippingAddress?.fullName}
                                </div>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="address-info"
                                >
                                    <span>Địa chỉ:</span>
                                    {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                                </div>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="phone-info"
                                >
                                    <span>Điện thoại :</span>
                                    {data?.shippingAddress?.phone}
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                            <WrapperContentInfo>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="delivery-info"
                                >
                                    <span className="name-delivery">FAST</span> Giao hàng tiết kiệm
                                </div>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="delivery-fee"
                                >
                                    <span>{data?.shippingPrice}</span>11111
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                            <WrapperContentInfo>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="payment-info"
                                >
                                    {' '}
                                    {orderContant[data?.paymentMethod]}
                                </div>
                                <div
                                    style={{ fontSize: '15px', fontWeight: '500', margin: '5px 0' }}
                                    className="status-payment"
                                >
                                    {data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>
                    <WrapperStyleContent>
                        <div
                            style={{
                                flex: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div style={{ width: '610px', fontSize: '15px', fontWeight: '500' }}>Sản phẩm</div>
                            <WrapperItemLabel>Giá</WrapperItemLabel>
                            <WrapperItemLabel>Số lượng</WrapperItemLabel>
                            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                        </div>
                        {data?.orderItems?.map((order) => {
                            return (
                                <WrapperProduct>
                                    <WrapperNameProduct>
                                        <img
                                            alt="ảnh sản phẩm"
                                            src={order?.image}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                objectFit: 'cover',
                                                border: '1px ,solid rgb(238 ,238 ,238)',
                                                padding: '2px',
                                            }}
                                        ></img>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',

                                                height: '70px',
                                            }}
                                        >
                                            {order?.name}
                                        </div>
                                    </WrapperNameProduct>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                                        <WrapperItem>{order?.amount}</WrapperItem>
                                        <WrapperItem>
                                            {order?.discount
                                                ? convertPrice((priceMemo * order?.discount) / 100)
                                                : '0 VND'}
                                        </WrapperItem>
                                    </div>
                                </WrapperProduct>
                            );
                        })}
                        <WrapperAllPrice>
                            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                            <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
                            <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
                        </WrapperAllPrice>
                    </WrapperStyleContent>
                </div>
            </div>
        </Loading>
    );
};

export default DetailsOrderPage;
