import { Checkbox, Form } from 'antd';
import {
    WrapperCountOrder,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    // WrapperPriceDiscount,
    WrapperRight,
    WrapperStyleDeliveli,
    WrapperStyleHeader,
    WrapperTotal,
} from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { StyleInputNumber } from '../../components/ProductDetailComponent/style';
import { useDispatch, useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import {
    decreaseAmount,
    increaseAmount,
    removeAllOrderProduct,
    removeOrderProduct,
    selectedOrder,
} from '../../redux/slides/orderSlide';
import { useEffect, useMemo, useState } from 'react';
import { convertPrice } from '../../utils';
import ModalComponet from '../../components/ModalComponent/ModalComponent';
import InputComPonent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import Step from '../../components/Step/Step';

const OrdersPage = () => {
    const navigate = useNavigate();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
    const [listChecked, setListChecked] = useState([]);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isModalUpdateInfo]);

    // Tạm tính
    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]);

    // Giảm giá
    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * totalDiscount) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    // Phí giao hàng
    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 1000000 && priceMemo < 5000000) {
            return 30000;
        } else if (priceMemo >= 5000000) {
            return 10000;
        } else if (order?.orderItemsSelected.length === 0) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]);

    // Tổng tiền
    const totalPriceMeno = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo);
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const dispatch = useDispatch();
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value);
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };
    // console.log('listChecked', listChecked);
    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };
    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    };

    const handleRemoveAllOrder = () => {
        if (listChecked?.length) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    };

    const handleAddCard = () => {
        // console.log('user', user);
        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm để thanh toán');
        } else if (!user?.phone || !user?.address || !user.name || !user.city) {
            setIsModalUpdateInfo(true);
        } else {
            navigate('/payment');
        }
    };

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;
    // console.log('data', data);

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsModalUpdateInfo(false);
    };

    const handleUpdateInfoUser = () => {
        // console.log('stateUser', stateUserDetails);
        const { name, phone, address, city } = stateUserDetails;
        if (name && phone && address && city) {
            mutationUpdate.mutate(
                { id: user?.id, token: user?.access_token, ...stateUserDetails },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, phone, address, city }));
                        setIsModalUpdateInfo(false);
                    },
                },
            );
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeAddress = () => {
        setIsModalUpdateInfo(true);
    };

    const itemsDelivery = [
        {
            title: '20.000 VNĐ',
            description: 'Dưới 1.000.000 VNĐ',
        },
        {
            title: '30.000 VNĐ',
            description: 'Từ 1.000.000 VNĐ => dưới 5.000.000 VNĐ',
        },
        {
            title: '10.000 VNĐ',
            description: 'Trên 5.000.000 VNĐ',
        },
    ];

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh', marginTop: '60px' }}>
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
                    Giỏ Hàng
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <WrapperStyleDeliveli>
                            <Step
                                items={itemsDelivery}
                                current={
                                    diliveryPriceMemo === 30000
                                        ? 2
                                        : diliveryPriceMemo === 20000
                                        ? 1
                                        : order?.orderItemsSelected.length === 0
                                        ? 0
                                        : 3
                                }
                            ></Step>
                        </WrapperStyleDeliveli>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox
                                    onChange={handleOnchangeCheckAll}
                                    checked={listChecked?.length === order?.orderItems?.length}
                                ></Checkbox>
                                <span>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span style={{ fontSize: '15px', fontWeight: '400' }}>Đơn giá</span>
                                <span style={{ fontSize: '15px', fontWeight: '400' }}>Số lượng</span>
                                <span style={{ fontSize: '15px', fontWeight: '400' }}>Thành tiền</span>
                                <DeleteOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleRemoveAllOrder}
                                ></DeleteOutlined>
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div
                                            style={{
                                                width: '390px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4',
                                            }}
                                        >
                                            <Checkbox
                                                onChange={onChange}
                                                value={order?.product}
                                                checked={listChecked.includes(order?.product)}
                                            ></Checkbox>
                                            <img
                                                src={order?.image}
                                                style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                                                alt="ảnh_SP"
                                            />
                                            <div
                                                style={{
                                                    width: '260px',
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
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>
                                                    {convertPrice(order?.price)}
                                                </span>
                                                {/* <WrapperPriceDiscount>{order?.amount}</WrapperPriceDiscount> */}
                                            </span>
                                            <WrapperCountOrder>
                                                <button
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            'decrease',
                                                            order?.product,
                                                            order?.amount === 1,
                                                        )
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <MinusOutlined
                                                        style={{ color: '#000', fontSize: '10px' }}
                                                    ></MinusOutlined>
                                                </button>
                                                <StyleInputNumber
                                                    defaultValue={order?.amount}
                                                    value={order?.amount}
                                                    size="small"
                                                ></StyleInputNumber>
                                                <button
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            'increase',
                                                            order?.product,
                                                            order?.amount === order?.countInstock,
                                                        )
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <PlusOutlined
                                                        style={{ color: '#000', fontSize: '10px' }}
                                                    ></PlusOutlined>
                                                </button>
                                            </WrapperCountOrder>
                                            <span
                                                style={{
                                                    color: 'rgb(255 ,66,78)',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {convertPrice(order?.price * order?.amount)}
                                            </span>
                                            <DeleteOutlined
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDeleteOrder(order?.product)}
                                            ></DeleteOutlined>
                                        </div>
                                    </WrapperItemOrder>
                                );
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',

                                        fontSize: '15px',
                                        margin: '8px 0',
                                    }}
                                >
                                    <span style={{ marginRight: '5px' }}>Địa chỉ nhận hàng: </span>
                                    <span
                                        style={{ marginRight: '5px', fontWeight: '600' }}
                                    >{`${user?.address}_${user?.city}`}</span>
                                    <span
                                        onClick={handleChangeAddress}
                                        style={{ color: 'blue', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Thay đổi địa chỉ ?
                                    </span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '15px',
                                        margin: '8px 0',
                                    }}
                                >
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                        {convertPrice(priceMemo)}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '15px',
                                        margin: '8px 0',
                                    }}
                                >
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                        {convertPrice(priceDiscountMemo)}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '15px',
                                        margin: '8px 0',
                                    }}
                                >
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                        {convertPrice(diliveryPriceMemo)}
                                    </span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56 ,52)', fontSize: '20px', fontWeight: '500' }}>
                                        {convertPrice(totalPriceMeno)}
                                    </span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponent
                            onClick={() => handleAddCard()}
                            size={40}
                            style={{
                                backgroundColor: 'rgb(255 ,57,69)',
                                height: '48px',
                                width: '320px',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                            }}
                            textButton={'Mua hàng'}
                        ></ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
            <ModalComponet
                forceRender
                title="Thông tin giao hàng"
                open={isModalUpdateInfo}
                onCancel={handleCancelUpdate}
                onOk={handleUpdateInfoUser}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        // onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người dùng!',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateUserDetails.name}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thành phố!',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateUserDetails.city}
                                onChange={handleOnchangeDetails}
                                name="city"
                            />
                        </Form.Item>
                        {/* <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Email',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateUserDetails.email}
                                onChange={handleOnchangeDetails}
                                name="email"
                            />
                        </Form.Item> */}
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Phone',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateUserDetails.phone}
                                onChange={handleOnchangeDetails}
                                name="phone"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Address',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateUserDetails.address}
                                onChange={handleOnchangeDetails}
                                name="address"
                            />
                        </Form.Item>

                        {/* <Form.Item
                        wrapperCol={{
                            offset: 20,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item> */}
                    </Form>
                </Loading>
            </ModalComponet>
        </div>
    );
};

export default OrdersPage;
