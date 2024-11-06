import { WrapperHeader } from './style';

import TableComponent from '../TableComponent/Table';

import { useState } from 'react';

import { useSelector } from 'react-redux';

import * as OrderService from '../../services/OrderService';
import { useQuery } from 'react-query';
import { orderContant } from '../../Containt';
import { convertPrice } from '../../utils';

const OrderAdmin = () => {
    const [rowSelected, setRowSelected] = useState('');

    const user = useSelector((state) => state?.user);

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        // console.log('res', res);
        return res;
    };

    const queryOrder = useQuery(['orders'], getAllOrder);
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const columns = [
        {
            title: 'Tên người mua',
            dataIndex: 'useName',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },

        {
            title: 'Paided',
            dataIndex: 'isPaid',
        },
        {
            title: 'paymentMethod',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Shiped',
            dataIndex: 'isDelivered',
        },
        {
            title: 'totalPrice',
            dataIndex: 'totalPrice',
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            // console.log('datngu', order);
            return {
                ...order,
                key: order._id,
                useName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
                isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
                totalPrice: convertPrice(order?.totalPrice),
            };
        });

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            {/* <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}>
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div> */}
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable}></TableComponent>
            </div>
        </div>
    );
};

export default OrderAdmin;
