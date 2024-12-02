import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/Table';
import { Button, Space, Tag, Modal, Select } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import { useQuery, useMutation } from 'react-query';
import { orderContant } from '../../Containt';
import { convertPrice } from '../../utils';
import Loading from '../LoadingComponent/Loading';
import * as message from '../MessageComponent/Message';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const OrderAdmin = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const user = useSelector((state) => state?.user);
    const navigate = useNavigate();

    const ORDER_STATUS = {
        PENDING: {
            label: 'Chờ xác nhận',
            color: 'gold',
            nextStatus: ['CONFIRMED', 'CANCELLED']
        },
        CONFIRMED: {
            label: 'Đã xác nhận',
            color: 'blue',
            nextStatus: ['SHIPPING', 'CANCELLED']
        },
        SHIPPING: {
            label: 'Đang giao hàng',
            color: 'purple',
            nextStatus: ['COMPLETED', 'CANCELLED']
        },
        COMPLETED: {
            label: 'Hoàn thành',
            color: 'green',
            nextStatus: []
        },
        CANCELLED: {
            label: 'Đã hủy',
            color: 'red',
            nextStatus: []
        }
    };

    // Query để lấy tất cả đơn hàng
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery(['orders'], getAllOrder);
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    // Mutation để cập nhật trạng thái
    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, status } = data;
            return OrderService.updateOrderStatus(id, { status }, user?.access_token);
        },
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công');
            setIsModalOpen(false);
            setSelectedStatus('');
            queryOrder.refetch();
        },
        onError: () => {
            message.error('Có lỗi xảy ra');
        }
    });

    const handleUpdateStatus = () => {
        if (!selectedStatus) {
            message.error('Vui lòng chọn trạng thái');
            return;
        }
        mutation.mutate({ id: rowSelected.id, status: selectedStatus });
    };

    const columns = [
        {
            title: 'Tên người mua',
            dataIndex: ['shippingAddress', 'fullName'],
            sorter: (a, b) => a.shippingAddress.fullName.localeCompare(b.shippingAddress.fullName),
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['shippingAddress', 'phone'],
            width: '120px'
        },
        {
            title: 'Địa chỉ',
            dataIndex: ['shippingAddress', 'address'],
            width: '200px'
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            render: (method) => orderContant.payment[method],
            width: '120px'
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'isPaid',
            render: (isPaid) => (
                <Tag color={isPaid ? 'green' : 'red'}>
                    {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
            ),
            width: '150px'
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'status',
            render: (status, record) => (
                <Space direction="vertical">
                    <Tag color={ORDER_STATUS[status]?.color}>
                        {ORDER_STATUS[status]?.label}
                    </Tag>
                    <Space>
                        {ORDER_STATUS[status]?.nextStatus.length > 0 && (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setRowSelected({
                                        id: record._id,
                                        currentStatus: status
                                    });
                                    setSelectedStatus('');
                                }}
                            >
                                Cập nhật trạng thái
                            </Button>
                        )}
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/order-details/${record._id}`)}
                        >
                            Xem chi tiết
                        </Button>
                    </Space>
                </Space>
            ),
            width: '250px'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            render: (price) => convertPrice(price),
            width: '120px'
        }
    ];

    const dataTable = orders?.data?.map((order) => ({
        ...order,
        key: order._id
    }));

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <Loading isLoading={isLoadingOrders || mutation.isLoading}>
                    <TableComponent 
                        columns={columns} 
                        data={dataTable}
                        scroll={{ x: 1200 }}
                    />
                </Loading>
            </div>

            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={isModalOpen}
                onOk={handleUpdateStatus}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedStatus('');
                }}
                confirmLoading={mutation.isLoading}
            >
                <div>
                    <p>Trạng thái hiện tại: 
                        <Tag color={ORDER_STATUS[rowSelected?.currentStatus]?.color}>
                            {ORDER_STATUS[rowSelected?.currentStatus]?.label}
                        </Tag>
                    </p>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn trạng thái mới"
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value)}
                    >
                        {ORDER_STATUS[rowSelected?.currentStatus]?.nextStatus.map((status) => (
                            <Select.Option key={status} value={status}>
                                {ORDER_STATUS[status].label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </div>
    );
};

export default OrderAdmin;
