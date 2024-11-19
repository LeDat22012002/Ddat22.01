import { LoginContainerLeft, LoginContainerRight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImageLogin from '../../accsets/image/imageLogin.png';
import { Image } from 'antd';
import { useEffect, useState } from 'react';
import { CloseOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useMutation } from 'react-query';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
// import * as message from '../../components/MessageComponent/Message';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide';

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispacth = useDispatch();
    const navigate_signUp = useNavigate();
    const navigate = useNavigate();
    const handleSign_up = () => {
        navigate_signUp('/sign-up');
    };
    // Call Api
    const mutation = useMutationHooks((data) => UserService.loginUser(data));
    const { data, isLoading, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }

            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                // console.log('decoded', decoded);
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token);
                }
            }
        }
    }, [isSuccess]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUer(id, token);
        dispacth(updateUser({ ...res?.data, access_token: token }));
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassword = (value) => {
        setPassword(value);
    };
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password,
        });
        // console.log(email, password);
    };
    const handleCloseLogin = () => {
        navigate('/');
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'rgba(0 ,0 ,0 , 0.53)',
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: '800px',
                    height: '445px',
                    borderRadius: '6px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    position: 'relative',
                }}
            >
                <LoginContainerLeft>
                    <h3 style={{ fontSize: '15px' }}>Xin chào!</h3>
                    <p style={{ fontSize: '15px' }}>Đăng nhập hoặc tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px', fontSize: '14px' }}
                        placeholder="Nhập email của bạn.."
                        value={email}
                        onChange={handleOnchangeEmail}
                    ></InputForm>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{ zIndex: '10', position: 'absolute', top: '4px', right: '8px' }}
                        >
                            {/* {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />} */}
                        </span>
                        <InputForm
                            value={password}
                            onChange={handleOnchangePassword}
                            placeholder="Nhập password của bạn.."
                            type={isShowPassword ? 'text' : 'password'}
                        ></InputForm>
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            style={{
                                backgroundColor: 'rgb(255,57,69)',
                                color: '#fff',
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px',
                                fontWeight: '400',
                                margin: '26px 0 10px',
                                border: 'none',
                            }}
                            textButton={'Đăng nhập '}
                        ></ButtonComponent>
                    </Loading>
                    <p>
                        <span
                            style={{
                                color: 'rgb(13 , 92 ,182)',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                            }}
                        >
                            Quên mật khẩu ?
                        </span>
                    </p>
                    <p style={{ fontSize: '14px' }}>
                        Chưa có tài khoản?
                        <span
                            onClick={handleSign_up}
                            style={{
                                color: 'rgb(13 , 92 ,182)',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                marginLeft: '5px',
                            }}
                        >
                            Tạo tài khoản
                        </span>
                    </p>
                </LoginContainerLeft>
                <LoginContainerRight>
                    <Image src={ImageLogin} preview={false} alt="imageLogin" height="203px" width="203px"></Image>
                    <h4 style={{ fontSize: '15px', fontWeight: '500' }}>Mua sắm tại Việt Thương Mussic</h4>
                </LoginContainerRight>
                <div
                    onClick={handleCloseLogin}
                    style={{ position: 'absolute', top: '3%', right: '2%', fontSize: '18px', cursor: 'pointer' }}
                >
                    <CloseOutlined />
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
