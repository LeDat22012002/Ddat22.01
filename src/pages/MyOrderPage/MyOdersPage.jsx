import { Card, Tag, Button, Space, Descriptions, Image, Divider } from 'antd';
import { ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
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
import { Modal } from 'antd';
import * as message from '../../components/MessageComponent/Message';

const MyOrdersPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log('User from Redux:', user); // Debug log để xem thông tin user
    console.log('User ID:', user?.id);
    console.log('Access Token:', user?.access_token);

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(user?.id, user?.access_token);
        return res.data;
    };

    const queryOrder = useQuery(
        { queryKey: ['orders'], queryFn: fetchMyOrder },
        {
            enabled: !!user?.id && !!user?.access_token,
        },
    );

    const { isLoading, data } = queryOrder;

    const ORDER_STATUS = {
        PENDING: {
            label: 'Chờ xác nhận',
            color: 'gold'
        },
        CONFIRMED: {
            label: 'Đã xác nhận',
            color: 'blue'
        },
        SHIPPING: {
            label: 'Đang giao hàng',
            color: 'purple'
        },
        COMPLETED: {
            label: 'Hoàn thành',
            color: 'green'
        },
        CANCELLED: {
            label: 'Đã hủy',
            color: 'red'
        }
    };

    const isOrderCancellable = (status) => {
        return status === 'PENDING';
    };

    const cancelOrderMutation = useMutation({
        mutationFn: (orderId) => {
            console.log('Mutation params:', {
                orderId,
                userId: user?.id,
                token: user?.access_token?.slice(0, 20) + '...'
            });

            if (!user?.access_token) {
                throw new Error('Không có token xác thực');
            }
            if (!user?.id) {
                throw new Error('Không tìm thấy ID người dùng');
            }

            return OrderService.cancelOrder(
                orderId,
                user.id,
                user.access_token
            );
        },
        onSuccess: (response) => {
            console.log('Cancel success response:', response);
            if (response.status === 'OK') {
                message.success('Hủy đơn hàng thành công');
                queryOrder.refetch();
            } else {
                message.error(response.message || 'Có lỗi xảy ra');
            }
        },
        onError: (error) => {
            console.error('Cancel order error:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng';
            message.error(errorMessage);
        }
    });

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: user?.access_token,
            },
        });
    };

    const handleCancelOrder = (orderId) => {
        if (!user?.id || !user?.access_token) {
            message.error('Vui lòng đăng nhập lại để thực hiện chức năng này');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            okText: 'Đồng ý',
            cancelText: 'Không',
            okButtonProps: {
                danger: true,
                loading: cancelOrderMutation.isLoading
            },
            onOk: async () => {
                try {
                    await cancelOrderMutation.mutateAsync(orderId);
                } catch (error) {
                    console.error('Error in handleCancelOrder:', error);
                }
            }
        });
    };

    const renderCancelButton = (order) => {
        const canCancel = isOrderCancellable(order.status);
        const buttonText = order.status === 'CANCELLED' ? 'Đã hủy' : 'Hủy đơn hàng';
        
        return (
            <Button
                danger
                onClick={() => handleCancelOrder(order._id)}
                disabled={!canCancel}
                loading={cancelOrderMutation.isLoading}
            >
                {buttonText}
            </Button>
        );
    };

    return (
        <Loading isLoading={isLoading || cancelOrderMutation.isLoading}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
                <h2 style={{ marginBottom: 24 }}>Đơn hàng của tôi</h2>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {data?.map((order) => (
                        <Card key={order._id}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Tag color={ORDER_STATUS[order.status]?.color}>
                                        {ORDER_STATUS[order.status]?.label}
                                    </Tag>
                                    <span style={{ color: '#666' }}>Mã đơn: {order._id}</span>
                                </div>

                                <Divider />

                                {/* Order Status */}
                                <Descriptions column={2}>
                                    <Descriptions.Item label="Trạng thái giao hàng">
                                        <Tag color={order.isDelivered ? 'green' : 'orange'}>
                                            {order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái thanh toán">
                                        <Tag color={order.isPaid ? 'green' : 'orange'}>
                                            {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                {/* Products */}
                                {order?.orderItems?.map((item) => (
                                    <div key={item._id} style={{ display: 'flex', marginBottom: 16 }}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover', borderRadius: 8 }}
                                        />
                                        <div style={{ marginLeft: 16, flex: 1 }}>
                                            <div style={{ fontSize: 14, marginBottom: 8 }}>{item.name}</div>
                                            <Space>
                                                <span style={{ color: '#ff4d4f', fontWeight: 500 }}>
                                                    {convertPrice(item.price)}
                                                </span>
                                                <span style={{ color: '#666' }}>x{item.amount}</span>
                                            </Space>
                                        </div>
                                    </div>
                                ))}

                                <Divider />

                                {/* Footer */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ marginRight: 8 }}>Tổng tiền:</span>
                                        <span style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 600 }}>
                                            {convertPrice(order?.totalPrice)}
                                        </span>
                                    </div>
                                    <Space>
                                        {renderCancelButton(order)}
                                        <Button 
                                            type="primary"
                                            onClick={() => handleDetailsOrder(order?._id)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                    ))}
                </Space>
            </div>
        </Loading>
    );
};

export default MyOrdersPage;
