import { useEffect, useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import { WapperLabel, WrapperContentProfile, WrapperHeader, WrapperInput, WrapperUploadFile } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';

const ProfilePage = () => {
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    // Call Api
    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });

    const dispacth = useDispatch();
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleGetDetailsUser(user?.id, user?.access_token);
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUer(id, token);
        dispacth(updateUser({ ...res?.data, access_token: token }));
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangeName = (value) => {
        setName(value);
    };
    const handleOnchangePhone = (value) => {
        const phoneNumber = value.replace(/[^\d]/g, '');
        setPhone(phoneNumber);
    };
    const handleOnchangeAddress = (value) => {
        setAddress(value);
    };
    const handleOnchangeAvatar = async ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            // Check if file is an image
            if (!file.type || !file.type.startsWith('image/')) {
                message.error('Chỉ được upload file ảnh');
                return;
            }
            // Check file size (e.g., max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                message.error('Kích thước ảnh không được vượt quá 2MB');
                return;
            }
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setAvatar(file.preview);
        }
    };

    const handleUpdate = () => {
        // Validate email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailRegex.test(email)) {
            message.error('Email không đúng định dạng');
            return;
        }

        // Validate phone number (10 digits)
        if (phone && !/^\d{10}$/.test(phone)) {
            message.error('Số điện thoại phải có 10 chữ số');
            return;
        }

        // Validate name
        if (name && name.length < 2) {
            message.error('Tên phải có ít nhất 2 ký tự');
            return;
        }

        // Validate address
        if (address && address.length < 5) {
            message.error('Địa chỉ phải có ít nhất 5 ký tự');
            return;
        }

        mutation.mutate({ 
            id: user?.id, 
            email, 
            name, 
            phone, 
            address, 
            avatar, 
            access_token: user?.access_token 
        });
    };

    return (
        <div style={{ width: '1270px', margin: '0 auto', marginTop: '80px', marginBottom: '10px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WapperLabel htmlFor="name">Name</WapperLabel>
                        <InputForm
                            style={{ width: '300px' }}
                            id="name"
                            value={name}
                            onChange={handleOnchangeName}
                        ></InputForm>
                        <ButtonComponent
                            onClick={handleUpdate}
                            style={{
                                margin: '0 10px',
                                border: '1px solid #ccc',
                            }}
                            textButton={'Update'}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WapperLabel htmlFor="email">Email</WapperLabel>
                        <InputForm
                            style={{ width: '300px' }}
                            id="email"
                            value={email}
                            onChange={handleOnchangeEmail}
                        ></InputForm>
                        <ButtonComponent
                            onClick={handleUpdate}
                            style={{
                                margin: '0 10px',
                                border: '1px solid #ccc',
                            }}
                            textButton={'Update'}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WapperLabel htmlFor="phone">Phone</WapperLabel>
                        <InputForm
                            style={{ width: '300px' }}
                            id="phone"
                            value={phone}
                            onChange={handleOnchangePhone}
                        ></InputForm>
                        <ButtonComponent
                            onClick={handleUpdate}
                            style={{
                                margin: '0 10px',
                                border: '1px solid #ccc',
                            }}
                            textButton={'Update'}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WapperLabel htmlFor="address">Address</WapperLabel>
                        <InputForm
                            style={{ width: '300px' }}
                            id="address"
                            value={address}
                            onChange={handleOnchangeAddress}
                        ></InputForm>
                        <ButtonComponent
                            onClick={handleUpdate}
                            style={{
                                margin: '0 10px',
                                border: '1px solid #ccc',
                            }}
                            textButton={'Update'}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WapperLabel htmlFor="avatar">Avatar</WapperLabel>
                        <WrapperUploadFile 
                            onChange={handleOnchangeAvatar} 
                            maxCount={1}
                            accept="image/*"
                            beforeUpload={() => false} // Prevent auto upload
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img
                                src={avatar}
                                style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                alt="avatar"
                            ></img>
                        )}
                        <ButtonComponent
                            onClick={handleUpdate}
                            style={{
                                margin: '0 10px',
                                border: '1px solid #ccc',
                            }}
                            textButton={'Update'}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    );
};

export default ProfilePage;
