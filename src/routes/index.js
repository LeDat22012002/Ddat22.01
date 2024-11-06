import AdminPage from '../pages/Admin/AdminPage';
import CategoryProductPage from '../pages/CategoryProductPage/CategoryProduct';
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage';
import HomePage from '../pages/Home/HomePage';
import MyOrdersPage from '../pages/MyOrderPage/MyOdersPage';
import NotFaultComponet from '../pages/Nofault/NotfaultComponent';
import OrdersPage from '../pages/Oders/OdersPage';
import OrderSuccessPage from '../pages/OrderSuccess/OrderSuccsess';
import PaymentPage from '../pages/Payment/PaymentPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductsPage from '../pages/Products/ProductsPage';
import ProfilePage from '../pages/Profile/Profile';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';

const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/orders',
        page: OrdersPage,
        isShowHeader: true,
    },

    {
        path: '/my-order',
        page: MyOrdersPage,
        isShowHeader: true,
    },

    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
    },

    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },

    {
        path: '/orderSuccess',
        page: OrderSuccessPage,
        isShowHeader: true,
    },

    {
        path: '/producs',
        page: ProductsPage,
        isShowHeader: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: '/products/:category',
        page: CategoryProductPage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true,
    },
    {
        path: '*',
        page: NotFaultComponet,
    },
];

export default routes;
