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
import DetailOrderAdmin from '../components/OrderAdmin/DetailOrderAdmin';
const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/orders',
        page: OrdersPage,
        isShowHeader: true,
        isShowFooter: true,
    },

    {
        path: '/my-order',
        page: MyOrdersPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/order-details/:id',
        page: DetailOrderAdmin,
        isShowHeader: true,
        isShowFooter: true,
    },

    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: true,
    },

    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isShowFooter: true,
    },

    {
        path: '/orderSuccess',
        page: OrderSuccessPage,
        isShowHeader: true,
        isShowFooter: true,
    },

    {
        path: '/producs',
        page: ProductsPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/products/:category',
        page: CategoryProductPage,
        isShowHeader: true,
        isShowFooter: true,
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
        isShowFooter: true,
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isShowFooter: false,
        isPrivate: true,
    },
    {
        path: '*',
        page: NotFaultComponet,
    },
];

export default routes;
