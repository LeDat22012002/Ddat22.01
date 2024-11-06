import { Image } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import { LoginContainerLeft, LoginContainerRight } from './style';
import ImageLogin from '../../accsets/image/imageLogin.png';
import { useEffect, useState } from 'react';
import { CloseOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const handle_SignIn = () => {
        navigate('/sign-in');
    };
    // Call Api
    const mutation = useMutationHooks((data) => UserService.SignUpUser(data));
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handle_SignIn();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassword = (value) => {
        setPassword(value);
    };
    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    };
    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword });
        // console.log('value', email, password, confirmPassword);
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
                    <h3>Xin chào!</h3>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>Đăng nhập hoặc tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
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
                            style={{ marginBottom: '10px' }}
                            placeholder="Nhập password của bạn.."
                            type={isShowPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleOnchangePassword}
                        ></InputForm>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{ zIndex: '10', position: 'absolute', top: '4px', right: '8px' }}
                        >
                            {/* {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />} */}
                        </span>
                        <InputForm
                            placeholder="Nhập lại password của bạn.."
                            type={isShowConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={handleOnchangeConfirmPassword}
                        ></InputForm>
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            style={{
                                backgroundColor: 'rgb(255,57,69)',
                                margin: '26px 0 10px',
                                border: 'none',
                                height: '40px',
                            }}
                            textButton={'Đăng kí '}
                        ></ButtonComponent>
                    </Loading>
                    <p style={{ fontSize: '14px' }}>
                        Bạn đã có tài khoản?
                        <span
                            onClick={handle_SignIn}
                            style={{
                                color: 'rgb(13 , 92 ,182)',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginLeft: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Đăng nhập
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

export default SignUpPage;
