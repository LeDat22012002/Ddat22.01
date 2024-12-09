import { 
    Checkbox, 
    Form, 
    Input,
    Row,
    Col,
    Radio
} from 'antd';
import { WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import { useDispatch, useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

import { useEffect, useMemo, useState } from 'react';
import { convertPrice } from '../../utils';
import ModalComponet from '../../components/ModalComponent/ModalComponent';
import InputComPonent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import * as PaymentService from '../../services/PaymentService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { PayPalButton } from 'react-paypal-button-v2';

const PaymentPage = () => {
    const navigate = useNavigate();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    const [payment, setPayment] = useState('later_money');
    const [delivery, setDelivery] = useState('fast');
    const [sdkReady, setSdkReady] = useState(false);
    const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [form] = Form.useForm();

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

    // Giảm giá // cur.amount
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

    // console.log('listChecked', listChecked);

    const validateDeliveryInfo = () => {
        if (!deliveryInfo.fullName?.trim()) {
            message.error('Vui lòng nhập họ tên người nhận');
            return false;
        }
        if (!deliveryInfo.phone?.trim()) {
            message.error('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!deliveryInfo.email?.trim()) {
            message.error('Vui lòng nhập email');
            return false;
        }
        if (!deliveryInfo.address?.trim()) {
            message.error('Vui lòng nhập địa chỉ');
            return false;
        }
        if (!deliveryInfo.city?.trim()) {
            message.error('Vui lòng nhập thành phố');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(deliveryInfo.email)) {
            message.error('Email không hợp lệ');
            return false;
        }
        
        // Validate phone number (Vietnam format)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(deliveryInfo.phone)) {
            message.error('Số điện thoại không hợp lệ');
            return false;
        }

        return true;
    };

    const handleAddOrder = () => {
        if (!validateDeliveryInfo()) {
            return;
        }

        if (user?.access_token && order?.orderItemsSelected && priceMemo && user?.id) {
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: deliveryInfo.fullName,
                address: deliveryInfo.address,
                phone: deliveryInfo.phone,
                city: deliveryInfo.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMeno,
                user: user?.id,
                email: deliveryInfo.email,
            });
        }
    };

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationAddOrder = useMutationHooks((data) => {
        const { token, ...rests } = data;
        const res = OrderService.createOrder({ ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder;
    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = [];
            order?.orderItemsSelected?.forEach((element) => {
                arrayOrdered.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
            message.success('Đặt hàng thành công');
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMeno: totalPriceMeno,
                },
            });
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

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

    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };
    const onSuccessPaypal = (details, data) => {
        if (!validateDeliveryInfo()) {
            return;
        }

        mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: deliveryInfo.fullName,
            address: deliveryInfo.address,
            phone: deliveryInfo.phone,
            city: deliveryInfo.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMeno,
            user: user?.id,
            email: deliveryInfo.email,
            isPaid: true,
            paidAt: details.update_time,
        });
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://sandbox.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
        // console.log('dattts', data);
    };

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, []);

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        email: user?.email || ''
    });

    const [useUserInfo, setUseUserInfo] = useState(true); // Toggle sử dụng thông tin user

    const handleChangeDeliveryInfo = (e) => {
        setDeliveryInfo({
            ...deliveryInfo,
            [e.target.name]: e.target.value
        });
    };

    const [inputType, setInputType] = useState('account'); // 'account' hoặc 'manual'

    const handleToggleUserInfo = (value) => {
        setInputType(value);
        if (value === 'account') {
            setDeliveryInfo({
                fullName: user?.name || '',
                phone: user?.phone || '',
                address: user?.address || '',
                city: user?.city || '',
                email: user?.email || ''
            });
        } else {
            // Xóa form khi chuyển sang chế độ tự nhập
            setDeliveryInfo({
                fullName: '',
                phone: '',
                address: '',
                city: '',
                email: ''
            });
        }
    };

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh', marginTop: '60px' }}>
            <Loading isLoading={isLoadingAddOrder}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3
                        style={{
                            marginTop: '1px',
                            paddingTop: '20px',
                            fontSize: '20px',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                    >
                        Thanh toán
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div style={{ padding: '10px 20px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: '500' }}>Sản phẩm đã chọn</span>
                                    {order?.orderItemsSelected?.map((item) => (
                                        <div
                                            key={item?.product}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px',
                                                margin: '15px 0',
                                                borderBottom: '1px solid #f5f5f5',
                                                paddingBottom: '15px',
                                            }}
                                        >
                                            <img
                                                src={item?.image}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                }}
                                                alt="product"
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    {item?.name}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#666' }}>
                                                    Số lượng: {item?.amount}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: 'rgb(255, 66, 78)',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {convertPrice(item?.price)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{ padding: '10px 20px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        marginBottom: '15px'
                                    }}>
                                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                            Thông tin người nhận
                                        </span>
                                        <Radio.Group 
                                            value={inputType} 
                                            onChange={(e) => handleToggleUserInfo(e.target.value)}
                                        >
                                            <Radio value="account">Dùng thông tin tài khoản</Radio>
                                            <Radio value="manual">Tự nhập thông tin</Radio>
                                        </Radio.Group>
                                    </div>

                                    <Form layout="vertical">
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Họ tên người nhận"
                                                    required
                                                >
                                                    <Input
                                                        name="fullName"
                                                        value={deliveryInfo.fullName}
                                                        onChange={handleChangeDeliveryInfo}
                                                        placeholder="Nhập họ tên"
                                                        disabled={inputType === 'account'}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Số điện thoại"
                                                    required
                                                >
                                                    <Input
                                                        name="phone"
                                                        value={deliveryInfo.phone}
                                                        onChange={handleChangeDeliveryInfo}
                                                        placeholder="Nhập số điện thoại"
                                                        disabled={inputType === 'account'}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            label="Email"
                                            required
                                        >
                                            <Input
                                                name="email"
                                                value={deliveryInfo.email}
                                                onChange={handleChangeDeliveryInfo}
                                                placeholder="Nhập email"
                                                disabled={inputType === 'account'}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Địa chỉ"
                                            required
                                        >
                                            <Input
                                                name="address"
                                                value={deliveryInfo.address}
                                                onChange={handleChangeDeliveryInfo}
                                                placeholder="Nhập địa chỉ"
                                                disabled={inputType === 'account'}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Thành phố"
                                            required
                                        >
                                            <Input
                                                name="city"
                                                value={deliveryInfo.city}
                                                onChange={handleChangeDeliveryInfo}
                                                placeholder="Nhập thành phố"
                                                disabled={inputType === 'account'}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <label style={{ fontSize: '20px', fontWeight: '500' }}>
                                        Chọn phương thức thanh toán
                                    </label>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio
                                            style={{
                                                backgroundColor: 'rgb(240, 248, 255)',
                                                padding: '20px',
                                                borderRadius: '4px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                            value="later_money"
                                        >
                                            Thanh toán khi nhận hàng
                                        </Radio>
                                        <Radio
                                            style={{
                                                backgroundColor: 'rgb(240, 248, 255)',
                                                padding: '20px',
                                                borderRadius: '4px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                            value="paypal"
                                        >
                                            Thanh toán bằng Paypal
                                        </Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
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
                                        <span style={{ marginRight: '5px' }}>Địa chỉ: </span>
                                        <span
                                            style={{ marginRight: '5px', fontWeight: '600' }}
                                        >{`${user?.address}_${user?.city}`}</span>
                                        <span
                                            onClick={handleChangeAddress}
                                            style={{ color: 'blue', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            Thay đổi
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
                                        <span
                                            style={{ color: 'rgb(254, 56 ,52)', fontSize: '20px', fontWeight: '500' }}
                                        >
                                            {convertPrice(totalPriceMeno)}
                                        </span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {payment === 'paypal' && sdkReady ? (
                                <div style={{ width: '320px' }}>
                                    <PayPalButton
                                        amount={totalPriceMeno}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={onSuccessPaypal}
                                        onError={() => {
                                            alert('Thanh toán thất bại');
                                        }}
                                    />
                                </div>
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    style={{
                                        backgroundColor: 'rgb(255 ,57,69)',
                                        height: '48px',
                                        width: '320px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#fff',
                                    }}
                                    textButton={'Đặt hàng'}
                                ></ButtonComponent>
                            )}
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
                                        message: 'Vui lng nhập Address',
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
            </Loading>
        </div>
    );
};

export default PaymentPage;
