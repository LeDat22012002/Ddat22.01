import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes';
import DefaultComponent from './components/DefaulComponent/Default';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import Loading from './components/LoadingComponent/Loading';
// import axios from 'axios';
// import axios from 'axios';
// import { useQuery } from 'react-query';

function App() {
    const user = useSelector((state) => state.user);

    const dispacth = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const { storageData, decoded } = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData);
        }
        setIsLoading(false);
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        // console.log('storageData', storageData, isJsonString(storageData));
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };

    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date();
            const { decoded } = handleDecoded();
            if (decoded?.exp < currentTime.getTime() / 1000) {
                const data = await UserService.refreshToken();
                config.headers['token'] = `Bearer ${data?.access_token}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUer(id, token);
        dispacth(updateUser({ ...res?.data, access_token: token }));
    };
    // useEffect(() => {
    //     fetchApi();
    // }, []);
    // console.log(process.env.REACT_APP_API_URL);
    // const fetchApi = async () => {
    //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll-product`);
    //     return res.data;
    // };
    // const query = useQuery('todos', fetchApi);
    // console.log('query', query);
    return (
        <div>
            <Loading isLoading={isLoading}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            const isCheckAuth = !route.isPrivate || user.isAdmin;
                            const Layout = route.isShowHeader && route.isShowFooter ? DefaultComponent : Fragment;
                            return (
                                <Route
                                    key={route.path}
                                    path={isCheckAuth ? route.path : undefined}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}

export default App;
