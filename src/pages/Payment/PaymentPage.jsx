import { Form, Radio } from 'antd';
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
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';

const PaymentPage = () => {
    const navigate = useNavigate();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [payment, setPayment] = useState('later_money');
    const [delivery, setDelivery] = useState('fast');
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

    const handleAddOrder = () => {
        if (
            user?.access_token &&
            order?.orderItemsSelected &&
            user?.name &&
            user?.address &&
            user?.phone &&
            user?.city &&
            priceMemo &&
            user?.id
        ) {
            // eslint-disable-next-line no-unused-expressions
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMeno,
                user: user?.id,
                email: user?.email,
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

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <Loading isLoading={isLoadingAddOrder}>
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
                        Thanh toán
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <label style={{ fontSize: '20px', fontWeight: '500' }}>
                                        Chọn phương thức giao hàng
                                    </label>
                                    <WrapperRadio onChange={handleDilivery} value={delivery}>
                                        <Radio
                                            style={{
                                                backgroundColor: 'rgb(240, 248, 255)',
                                                padding: '20px',
                                                borderRadius: '4px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                            value="fast"
                                        >
                                            <span style={{ color: '#ea8500', fontWeight: 'bold', fontSize: '15px' }}>
                                                FAST
                                            </span>
                                            Giao hàng tiết kiệm
                                        </Radio>
                                        <Radio
                                            style={{
                                                backgroundColor: 'rgb(240, 248, 255)',
                                                padding: '20px',
                                                borderRadius: '4px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                            value="gojek"
                                        >
                                            <span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span>
                                            Giao hàng tiết kiệm
                                        </Radio>
                                    </WrapperRadio>
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
                            <ButtonComponent
                                onClick={() => handleAddOrder()}
                                size={40}
                                style={{
                                    backgroundColor: 'rgb(255 ,57,69)',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                textButton={'Đặt hàng'}
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
            </Loading>
        </div>
    );
};

export default PaymentPage;
