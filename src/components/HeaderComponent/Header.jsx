import { Badge, Col, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    WrapperContentPopup,
    WrapperHeader,
    WrapperHeaderAccount,
    WrapperTextHeader,
    WrapperTextHeaderSmall,
} from './style';

import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtoninputSearch from '../ButtoninputSearch/ButtoninputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/counterSlides';
import logo from '../../accsets/image/logo1.png';
import { logout } from '../../redux/slides/orderSlide';

const HeaderComponent = ({ isHeddenSearch = false, isHeddenCart = false }) => {
    const navigate = useNavigate();
    // click khi đăng nhập
    const handleLogin = () => {
        navigate('/sign-in');
    };
    const [isOpenPopover, setIsOpenPopover] = useState(false);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [search, setSearch] = useState('');
    const order = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    // console.log('user', user);
    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        dispatch(logout());

        setLoading(true);
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
    };
    useEffect(() => {
        setLoading(true);
        setUserName(user?.name);
        setUserAvatar(user?.avatar);
        setLoading(false);
    }, [user?.name, user?.avatar]);

    const content = (
        <div>
            <WrapperContentPopup
                onClick={() => {
                    handleClickNavigate('profile');
                }}
            >
                Thông tin người dùng
            </WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup
                    onClick={() => {
                        handleClickNavigate('admin');
                    }}
                >
                    Quản lí hệ thống
                </WrapperContentPopup>
            )}
            <WrapperContentPopup
                onClick={() => {
                    handleClickNavigate('my-order');
                }}
            >
                Đơn hàng của tôi
            </WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile');
        } else if (type === 'admin') {
            navigate('/system/admin');
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token,
                },
            });
        } else {
            handleLogout();
        }
        setIsOpenPopover(false);
    };
    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };
    const handleHomePage = () => {
        navigate('/');
    };

    return (
        <div
            style={{
                width: '100%',
                backgroundColor: '#333333',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <WrapperHeader
                style={{ justifyContent: isHeddenSearch && isHeddenSearch ? 'space-between' : 'unset' }}
                gutter={16}
            >
                <Col span={5}>
                    <WrapperTextHeader>
                        <img onClick={handleHomePage} alt="logo" src={logo}></img>
                    </WrapperTextHeader>
                </Col>
                {!isHeddenSearch && (
                    <Col span={13}>
                        <ButtoninputSearch
                            bordered={false}
                            placeholder="Nhập nội dung tìm kiếm"
                            textButton="Tìm kiếm"
                            size="large"
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img
                                    src={userAvatar}
                                    alt="avatar"
                                    style={{ height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                ></img>
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}

                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopover}>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setIsOpenPopover((prev) => !prev)}
                                        >
                                            {userName?.length ? userName : user?.email}
                                        </div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Đăng nhập / Đăng kí </WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài Khoảng</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHeddenCart && (
                        <div onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
                            <Badge count={order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>

                            <WrapperTextHeaderSmall WrapperTextHeaderSmall></WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;
