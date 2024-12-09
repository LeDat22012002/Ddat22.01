import {
    WrapperInfo,
    WrapperContainer,
    WrapperValue,
    WrapperItemOrder,
    // WrapperCountOrder,
    WrapperItemOrderInfo,
} from './style';
// import { StyleInputNumber } from '../../components/ProductDetailComponent/style';
// import { useSelector } from 'react-redux';

import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../Containt';
import { convertPrice } from '../../utils';

const OrderSuccessPage = () => {
    // const order = useSelector((state) => state.order);
    const location = useLocation();
    // console.log('location', location);
    const { state } = location;

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh', marginTop: '60px' }}>
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            {/* <WrapperInfo>
                                <div>
                                    <label style={{ fontSize: '18px', fontWeight: '500' }}>Phương thức giao hàng</label>

                                    <WrapperValue>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>
                                            {orderContant.delivery[state?.delivery]}
                                        </span>
                                        Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo> */}
                            <WrapperInfo>
                                <div>
                                    <label style={{ fontSize: '18px', fontWeight: '500' }}>
                                        Chọn phương thức thanh toán
                                    </label>
                                    <WrapperValue>{orderContant.payment[state?.payment]}</WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.name}>
                                            <div
                                                style={{
                                                    width: '400px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <img
                                                    src={order?.image}
                                                    style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                                                    alt="ảnh_SP"
                                                />
                                                <div
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '15px',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {order?.name}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    flex: '1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    justifyContent: 'space-around',
                                                }}
                                            >
                                                <span>
                                                    <span style={{ fontSize: '15px', color: '#242424' }}>
                                                        Giá tiền :{convertPrice(order?.price)}
                                                    </span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '15px', color: '#242424' }}>
                                                        Số lượng :{order?.amount}
                                                    </span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    );
                                })}
                            </WrapperItemOrderInfo>
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ fontSize: '16px', color: 'red', fontWeight: '600' }}>
                                    Tổng tiền :{convertPrice(state?.totalPriceMeno)}
                                </span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default OrderSuccessPage;
