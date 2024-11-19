import { Col, Pagination, Row } from 'antd';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponet from '../../components/NavbarComponent/NavbarComponet';
import { WrapperProducts, WrapperNavbar } from './style';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import { useEffect, useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounceHooks } from '../../hook/Depauce';

const CategoryProductPage = () => {
    const location = useLocation();
    console.log('location', location);
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounceHooks(searchProduct, 500);
    const { state } = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const fetchProductCategory = async (category, page, limit) => {
        const res = await ProductService.getProductCategory(category, page, limit);
        if (res?.status === 'OK') {
            setLoading(false);
            setProducts(res?.data?.name);
            setPanigate({ ...panigate, total: res?.totalPage });
        } else {
            setLoading(false);
        }
        console.log('datt', res);
    };

    useEffect(() => {
        if (state) {
            fetchProductCategory(state, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit]);

    const handleOnchange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    };

    return (
        <Loading isLoading={loading}>
            <div style={{ backgroundColor: '#efefef', width: '100%', height: 'calc(100vh-64px)' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% -20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavbarComponet></NavbarComponet>
                        </WrapperNavbar>
                        <Col
                            span={20}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <WrapperProducts>
                                {products
                                    ?.filter((pro) => {
                                        if (searchDebounce === '') {
                                            return pro;
                                        } else if (pro?.name?.toLowerCase().includes(searchDebounce.toLowerCase())) {
                                            return pro;
                                        }
                                    })
                                    ?.map((product) => {
                                        return (
                                            <CardComponent
                                                key={product._id}
                                                countInStock={product.countInStock}
                                                description={product.description}
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                                rating={product.rating}
                                                type={product.type}
                                                selled={product.selled}
                                                discount={product.discount}
                                                id={product._id}
                                                category={product.category}
                                            />
                                        );
                                    })}
                            </WrapperProducts>
                            <Pagination
                                defaultCurrent={panigate.page + 1}
                                total={panigate?.total}
                                style={{ marginTop: '10px', textAlign: 'center' }}
                                onChange={handleOnchange}
                            ></Pagination>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default CategoryProductPage;
