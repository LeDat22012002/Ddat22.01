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
        setPhone(value);
    };
    const handleOnchangeAddress = (value) => {
        setAddress(value);
    };
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token });

        // console.log('update', email, name, phone, address, avatar);
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
                        <WrapperUploadFile WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>select file</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img
                                src={avatar}
                                style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                alt="avatar"
                            ></img>
                        )}
                        {/* <InputForm
                            style={{ width: '300px' }}
                            id="avatar"
                            value={avatar}
                            onChange={handleOnchangeAvatar}
                        ></InputForm> */}
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
