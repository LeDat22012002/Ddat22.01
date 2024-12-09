import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space, theme, Badge, Divider, Progress, Tag } from 'antd';
import {
    ShoppingCartOutlined,
    DollarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    RiseOutlined,
    FallOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import * as DashboardService from '../../services/DashboardService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title as ChartTitle, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { convertPrice } from '../../utils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend,
    Filler
);

const { useToken } = theme;
const { Title, Text } = Typography;

const DashboardAdmin = () => {
    const { token } = useToken();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await DashboardService.getDashboardSummary();
                if (res?.status === 'OK') {
                    setDashboardData(res.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const revenueChartData = {
        labels: dashboardData?.monthlyRevenue?.map((item) => `Tháng ${item._id}`) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: dashboardData?.monthlyRevenue?.map((item) => item.revenue) || [],
                borderColor: token.colorPrimary,
                backgroundColor: `${token.colorPrimary}20`,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const recentOrdersChartData = {
        labels: dashboardData?.recentOrders?.map((item) => item._id) || [],
        datasets: [
            {
                label: 'Số đơn hàng',
                data: dashboardData?.recentOrders?.map((item) => item.count) || [],
                backgroundColor: [
                    token.colorPrimary,
                    token.colorSuccess,
                    token.colorWarning,
                    token.colorInfo,
                    token.colorError,
                    `${token.colorPrimary}80`,
                    `${token.colorSuccess}80`,
                ],
                borderRadius: 8,
            },
        ],
    };

    const topProductColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space size="middle">
                    <Badge count={record.selled > 50 ? <ShoppingOutlined style={{ color: '#f5222d' }} /> : 0}>
                        <img
                            src={record.image}
                            alt={text}
                            style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: token.borderRadiusLG,
                            }}
                        />
                    </Badge>
                    <Space direction="vertical" size={0}>
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ID: {record._id}
                        </Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Đã bán',
            dataIndex: 'selled',
            key: 'selled',
            sorter: (a, b) => a.selled - b.selled,
            render: (value) => (
                <Space>
                    <Progress
                        percent={Math.min(100, (value / 100) * 100)}
                        size="small"
                        format={() => value}
                        status={value > 50 ? 'success' : 'normal'}
                    />
                </Space>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Tag color="gold" style={{ fontSize: 14, padding: '4px 8px' }}>
                    {convertPrice(price)}
                </Tag>
            ),
        },
    ];

    const getStatisticProps = (title, value, prefix, color, suffix, loading) => ({
        title: (
            <Space>
                {prefix}
                <Text>{title}</Text>
            </Space>
        ),
        value: value,
        loading: loading,
        valueStyle: { color: color },
        suffix: suffix,
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                type: 'category',
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false
                }
            }
        }
    };

    return (
        <div style={{ padding: 24, background: token.colorBgContainer }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ margin: 0 }}>
                        Tổng quan
                    </Title>
                    <Text type="secondary">Thống kê hoạt động kinh doanh</Text>
                </Space>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable bodyStyle={{ padding: 20 }}>
                            <Statistic
                                {...getStatisticProps(
                                    'Tổng đơn hàng',
                                    dashboardData?.orderStats?.reduce((acc, curr) => acc + curr.count, 0) || 0,
                                    <ShoppingCartOutlined style={{ fontSize: 20 }} />,
                                    token.colorPrimary,
                                    <ArrowUpOutlined />,
                                    loading,
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable bodyStyle={{ padding: 20 }}>
                            <Statistic
                                {...getStatisticProps(
                                    'Doanh thu tháng này',
                                    dashboardData?.monthlyRevenue?.slice(-1)[0]?.revenue || 0,
                                    <DollarOutlined style={{ fontSize: 20 }} />,
                                    token.colorPrimary,
                                    <ArrowUpOutlined />,
                                    loading,
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable bodyStyle={{ padding: 20 }}>
                            <Statistic
                                {...getStatisticProps(
                                    'Đơn hàng hoàn thành',
                                    dashboardData?.orderStats?.find((stat) => stat._id === 'COMPLETED')?.count || 0,
                                    <CheckCircleOutlined style={{ fontSize: 20 }} />,
                                    token.colorSuccess,
                                    <ArrowUpOutlined />,
                                    loading,
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable bodyStyle={{ padding: 20 }}>
                            <Statistic
                                {...getStatisticProps(
                                    'Đơn hàng chờ xử lý',
                                    dashboardData?.orderStats?.find((stat) => stat._id === 'PENDING')?.count || 0,
                                    <UserOutlined style={{ fontSize: 20 }} />,
                                    token.colorWarning,
                                    <ArrowUpOutlined />,
                                    loading,
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card
                            bordered={false}
                            title={
                                <Space>
                                    <RiseOutlined />
                                    <Text strong>Doanh thu theo tháng</Text>
                                </Space>
                            }
                        >
                            <Line
                                data={revenueChartData}
                                options={chartOptions}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            bordered={false}
                            title={
                                <Space>
                                    <ShoppingOutlined />
                                    <Text strong>Đơn hàng 7 ngày gần đây</Text>
                                </Space>
                            }
                        >
                            <Bar
                                data={recentOrdersChartData}
                                options={chartOptions}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
                    bordered={false}
                    title={
                        <Space>
                            <ShoppingOutlined />
                            <Text strong>Top sản phẩm bán chạy</Text>
                        </Space>
                    }
                >
                    <Table
                        columns={topProductColumns}
                        dataSource={dashboardData?.topProducts}
                        rowKey="_id"
                        loading={loading}
                        pagination={false}
                    />
                </Card>

                <Row gutter={[16, 16]}>
                    {dashboardData?.orderStats?.map((stat) => (
                        <Col xs={24} sm={12} lg={6} key={stat._id}>
                            <Card hoverable bodyStyle={{ padding: 20 }}>
                                <Statistic
                                    title={
                                        <Space>
                                            {stat._id === 'COMPLETED' ? (
                                                <Badge status="success" text={`Đơn hàng ${stat._id}`} />
                                            ) : (
                                                <Badge status="processing" text={`Đơn hàng ${stat._id}`} />
                                            )}
                                        </Space>
                                    }
                                    value={stat.count}
                                    suffix={
                                        <Tag color={stat._id === 'COMPLETED' ? 'success' : 'processing'}>
                                            {convertPrice(stat.totalAmount)}
                                        </Tag>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Space>
        </div>
    );
};

export default DashboardAdmin;
