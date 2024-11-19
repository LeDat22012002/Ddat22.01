import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { AppstoreAddOutlined, AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/Header';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import AdminBrand from '../../components/AdminBrand/AdminBrand';
import AdminCategory from '../../components/AdminCategory/AdminCategory';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Thương hiệu', 'brand', <AppstoreOutlined />),
        getItem('Danh mục', 'category', <AppstoreOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreAddOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingCartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('');
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser></AdminUser>;
            case 'brand':
                return <AdminBrand />;
            case 'category':
                return <AdminCategory />;
            case 'product':
                return <AdminProduct />;
            case 'order':
                return <OrderAdmin />;
            default:
                return <></>;
        }
    };
    const handleOnclick = ({ key }) => {
        setKeySelected(key);
    };
    // console.log('keySelected', keySelected);
    return (
        <>
            <HeaderComponent isHeddenSearch isHeddenCart />
            <div style={{ display: 'flex', marginTop: '70px' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: '256px',
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnclick}
                />
                <div style={{ flex: 1, padding: '15px' }}>{renderPage(keySelected)}</div>
            </div>
        </>
    );
};

export default AdminPage;
