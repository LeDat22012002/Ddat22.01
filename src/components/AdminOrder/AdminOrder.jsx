import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/Table';
import { Button, Space, Tag } from 'antd';
import { useQuery } from 'react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import { orderContant } from '../../contant';

const AdminOrder = () => {
    const user = useSelector((state) => state?.user);
    const [searchText, setSearchText] = useState('');
    const [rowSelected, setRowSelected] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery(['orders'], getAllOrder);
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <InputComponent
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    });

    const columns = [
        {
            title: 'Tên người mua',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Thanh toán',
            dataIndex: 'isPaid',
            filters: [
                { text: 'Đã thanh toán', value: 'Đã thanh toán' },
                { text: 'Chưa thanh toán', value: 'Chưa thanh toán' },
            ],
            onFilter: (value, record) => record.isPaid === value,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            filters: [
                { text: 'PayPal', value: 'paypal' },
                { text: 'Tiền mặt', value: 'later_money' },
            ],
            onFilter: (value, record) => record.paymentMethod === value,
        },
        {
            title: 'Giao hàng',
            dataIndex: 'isDelivered',
            filters: [
                { text: 'Đã giao hàng', value: 'Đã giao hàng' },
                { text: 'Chưa giao hàng', value: 'Chưa giao hàng' },
            ],
            onFilter: (value, record) => record.isDelivered === value,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (text) => convertPrice(text),
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return {
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
                isDelivered: order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
                totalPrice: order?.totalPrice,
            };
        });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingOrders}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => {
                                setRowSelected(record._id);
                            },
                        };
                    }}
                />
            </div>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                    gap: '8px',
                }}
            >
                <button
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                    }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoadingOrders}
                >
                    Trước
                </button>

                {Array.from({ length: orders?.totalPages || 1 }).map((_, index) => (
                    <button
                        key={index + 1}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: currentPage === index + 1 ? 'rgb(11, 116, 229)' : 'white',
                            color: currentPage === index + 1 ? 'white' : 'black',
                        }}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        cursor: currentPage === (orders?.totalPages || 1) ? 'not-allowed' : 'pointer',
                        backgroundColor: currentPage === (orders?.totalPages || 1) ? '#f5f5f5' : 'white',
                    }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === (orders?.totalPages || 1) || isLoadingOrders}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default AdminOrder; 