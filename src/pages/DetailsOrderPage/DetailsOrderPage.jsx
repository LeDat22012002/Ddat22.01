import { useLocation, useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Timeline, Descriptions, Table, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import * as OrderService from '../../services/OrderService';
import { useQuery } from 'react-query';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';

const { Title, Text } = Typography;

const DetailsOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const params = useParams();
    const { id } = params;

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token);
        return res.data;
    };

    const queryOrder = useQuery({ 
        queryKey: ['orders-details'], 
        queryFn: fetchDetailsOrder 
    });
    
    const { isLoading, data } = queryOrder;

    const renderStatus = (status) => {
        switch(status) {
            case 'PENDING':
                return <Tag color="warning">Chờ xác nhận</Tag>;
            case 'CONFIRMED':
                return <Tag color="processing">Đã xác nhận</Tag>;
            case 'SHIPPING':
                return <Tag color="cyan">Đang giao hàng</Tag>;
            case 'DELIVERED':
                return <Tag color="success">Đã giao hàng</Tag>;
            case 'COMPLETED':
                return <Tag color="success">Đã hoàn thành</Tag>;
            case 'CANCELLED':
                return <Tag color="error">Đã hủy</Tag>;
            default:
                return <Tag>Không xác định</Tag>;
        }
    }

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                        src={record.image} 
                        alt={text} 
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Text>{text}</Text>
                </div>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => convertPrice(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            align: 'right',
            render: (_, record) => convertPrice(record.price * record.amount),
        },
    ];

    return (
        <Loading isLoading={isLoading}>
            <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Title level={4} style={{ marginBottom: 24 }}>Chi tiết đơn hàng #{id}</Title>
                    
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card title="Trạng thái đơn hàng" style={{ marginBottom: 24 }}>
                                {renderStatus(data?.status)}
                                {data?.isDelivered && (
                                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                        Đã giao hàng vào lúc: {new Date(data?.deliveredAt).toLocaleString()}
                                    </Text>
                                )}
                            </Card>

                            <Card title="Thông tin giao hàng" style={{ marginBottom: 24 }}>
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><UserOutlined /> Người nhận</>}>
                                        {data?.shippingAddress?.fullName}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                                        {data?.shippingAddress?.phone}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                                        {data?.shippingAddress?.address}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card title="Thanh toán">
                                <Descriptions column={1}>
                                    <Descriptions.Item label={<><CreditCardOutlined /> Phương thức</>}>
                                        {data?.paymentMethod}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        {data?.isPaid ? (
                                            <Tag icon={<CheckCircleOutlined />} color="success">
                                                Đã thanh toán
                                            </Tag>
                                        ) : (
                                            <Tag icon={<ClockCircleOutlined />} color="error">
                                                Chưa thanh toán
                                            </Tag>
                                        )}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        <Col span={16}>
                            <Card>
                                <Table 
                                    columns={columns}
                                    dataSource={data?.orderItems}
                                    pagination={false}
                                    rowKey="_id"
                                    summary={() => (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={3}>
                                                    <Text strong>Tạm tính</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <Text strong>{convertPrice(data?.itemsPrice)}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={3}>
                                                    <Text strong>Phí vận chuyển</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <Text strong>{convertPrice(data?.shippingPrice)}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={3}>
                                                    <Text strong type="danger">Tổng cộng</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <Text strong type="danger" style={{ fontSize: 16 }}>
                                                        {convertPrice(data?.totalPrice)}
                                                    </Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default DetailsOrderPage;
