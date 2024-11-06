import { useQuery } from 'react-query';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import {
    WrapperContainer,
    WrapperFooterItem,
    WrapperHeaderItem,
    WrapperItemOrder,
    WrapperListOrder,
    WrapperStatus,
} from './style';
import { convertPrice } from '../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
const MyOrdersPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    // console.log('params', location);
    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token);
        // console.log('res', res);
        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['orders'], queryFn: fetchMyOrder },
        {
            enabled: state?.id && state?.token,
        },
    );
    const { isLoading, data } = queryOrder;

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };

    const renderProduct = (data) => {
        return data?.map((order) => {
            return (
                <WrapperHeaderItem>
                    <img
                        src={order?.image}
                        alt="ảnh sản phẩm"
                        style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            border: '1px solid rgb(238 ,238 ,238)',
                            padding: '2px',
                        }}
                    ></img>

                    <div
                        style={{
                            // width: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            // marginLeft: '20px',

                            fontSize: '13px',
                        }}
                    >
                        {order?.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                        <span style={{ fontSize: '13px', color: '#242424', marginLeft: '10px' }}>
                            Số lượng : {order?.amount}
                        </span>
                    </div>
                </WrapperHeaderItem>
            );
        });
    };

    return (
        <Loading isLoading={isLoading}>
            <WrapperContainer>
                <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
                    <h3
                        style={{
                            marginTop: '1px',
                            paddingTop: '20px',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                    >
                        Đơn hàng của tôi
                    </h3>
                    <WrapperListOrder>
                        {data?.map((order) => {
                            return (
                                <WrapperItemOrder>
                                    <WrapperStatus>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                                        <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '500' }}>
                                            <span
                                                style={{
                                                    color: 'rgb(255 ,66, 78)',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Giao hàng :
                                            </span>
                                            {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}
                                        </div>
                                        <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '500' }}>
                                            <span style={{ color: 'rgb(255 ,66, 78)' }}>Thanh toán:</span>
                                            {`${order.isPaid ? 'Đã thanh toán ' : 'Chưa thanh toán'}`}
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <WrapperFooterItem>
                                        <div>
                                            <span
                                                style={{
                                                    color: 'rgb(255 ,66 ,78)',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    marginRight: '2px',
                                                }}
                                            >
                                                Tổng tiền:
                                            </span>
                                            <span
                                                style={{ fontSize: '13px', color: 'rgb(56,56,61)', fontWeight: '700' }}
                                            >
                                                {convertPrice(order?.totalPrice)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', textAlign: 'center' }}>
                                            <ButtonComponent
                                                size={40}
                                                style={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11 ,116 ,229)',
                                                }}
                                                textButton={'Hủy đơn hàng'}
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                style={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11 ,116 ,229)',
                                                }}
                                                textButton={'Xem chi tiết'}
                                            ></ButtonComponent>
                                        </div>
                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            );
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    );
};

export default MyOrdersPage;
