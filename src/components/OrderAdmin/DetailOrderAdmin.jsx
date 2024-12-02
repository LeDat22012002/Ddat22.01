import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from 'react-query';
import { Card, Descriptions, Table, Tag, Timeline, Typography, Button, Space, Modal, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as OrderService from '../../services/OrderService';
import { orderContant } from '../../Containt';
import { convertPrice } from '../../utils';
import Loading from '../LoadingComponent/Loading';
import styled from 'styled-components';

const { Title, Text } = Typography;

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const PageTitle = styled(Title)`
    margin: 0 !important;
`;

const DetailOrderAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user);

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

    const { isLoading, data: orderDetails, refetch } = useQuery(['order-details', id], () => 
        OrderService.getDetailsOrder(id, user?.access_token)
    );

    const cancelOrderMutation = useMutation({
        mutationFn: () => {
            return OrderService.cancelOrder(id, user?.access_token);
        },
        onSuccess: () => {
            message.success('Hủy đơn hàng thành công');
            refetch();
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
        }
    });

    const handleCancelOrder = () => {
        Modal.confirm({
            title: 'Xác nhận hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: () => {
                cancelOrderMutation.mutate();
            }
        });
    };

    const orderItemColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <img 
                        src={record.image} 
                        alt={text} 
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div>
                        <Text strong>{text}</Text>
                        <div style={{ color: '#666' }}>Mã SP: {record.product}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => convertPrice(price)
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center'
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            align: 'right',
            render: (_, record) => convertPrice(record.price * record.amount)
        }
    ];

    return (
        <Loading isLoading={isLoading}>
            <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh',marginTop:'60px' }}>
                <HeaderWrapper>
                    <Space size="middle">
                        <Button 
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/system/admin')}
                            size="middle"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 500
                            }}
                        >
                            Quay lại
                        </Button>
                    </Space>
                </HeaderWrapper>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card>
                        <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                            <Descriptions.Item label="Trạng thái đơn hàng">
                                <Tag color={ORDER_STATUS[orderDetails?.data?.status]?.color}>
                                    {ORDER_STATUS[orderDetails?.data?.status]?.label}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian đặt hàng">
                                {new Date(orderDetails?.data?.createdAt).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán">
                                {orderContant.payment[orderDetails?.data?.paymentMethod]}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái thanh toán">
                                <Tag color={orderDetails?.data?.isPaid ? 'green' : 'red'}>
                                    {orderDetails?.data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </Tag>
                            </Descriptions.Item>
                            {orderDetails?.data?.isPaid && (
                                <Descriptions.Item label="Thời gian thanh toán">
                                    {new Date(orderDetails?.data?.paidAt).toLocaleString()}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>

                    <Card style={{ marginBottom: 20 }}>
                        <Descriptions title="Thông tin giao hàng" bordered column={1}>
                            <Descriptions.Item label="Người nhận">
                                {orderDetails?.data?.shippingAddress?.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {orderDetails?.data?.shippingAddress?.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">
                                {orderDetails?.data?.shippingAddress?.address}, {orderDetails?.data?.shippingAddress?.city}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card style={{ marginBottom: 20 }}>
                        <Title level={5}>Sản phẩm đặt mua</Title>
                        <Table 
                            columns={orderItemColumns}
                            dataSource={orderDetails?.data?.orderItems}
                            pagination={false}
                            rowKey="_id"
                            summary={() => (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <Text strong>Tạm tính</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text strong>{convertPrice(orderDetails?.data?.itemsPrice)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <Text strong>Phí vận chuyển</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text strong>{convertPrice(orderDetails?.data?.shippingPrice)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <Text strong type="danger">Tổng cộng</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text strong type="danger" style={{ fontSize: 16 }}>
                                                {convertPrice(orderDetails?.data?.totalPrice)}
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />
                    </Card>

                    {orderDetails?.data?.statusHistory && (
                        <Card>
                            <Title level={5}>Lịch sử trạng thái</Title>
                            <Timeline>
                                {orderDetails?.data?.statusHistory.map((history, index) => (
                                    <Timeline.Item 
                                        key={index}
                                        color={ORDER_STATUS[history.status]?.color}
                                    >
                                        <div>
                                            <Tag color={ORDER_STATUS[history.status]?.color}>
                                                {ORDER_STATUS[history.status]?.label}
                                            </Tag>
                                            <div>{new Date(history.updatedAt).toLocaleString()}</div>
                                            {history.note && (
                                                <div style={{ color: '#666' }}>{history.note}</div>
                                            )}
                                        </div>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    )}
                </div>
            </div>
        </Loading>
    );
};

export default DetailOrderAdmin;
