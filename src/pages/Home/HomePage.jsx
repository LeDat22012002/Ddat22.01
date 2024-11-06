import React, { useEffect, useState } from 'react';
import TypeProduct from '../../components/TypeProductComponet/TypeProductComponent';
import { WrapperButtonMore, WrapperNavbar, WrapperProducts, WrapperTypeProduct } from './style';
import slider1 from '../../accsets/image/slider1.webp';
import slider2 from '../../accsets/image/slider2.webp';
import slider3 from '../../accsets/image/slider3.webp';
import SliderComponet from '../../components/SliderComponent/SliderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from 'react-query';
import * as ProductService from '../../services/ProductService';
import * as CategoryService from '../../services/CategoryService';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading';
import { useDebounceHooks } from '../../hook/Depauce';
import { Col, Row } from 'antd';
import NavbarComponet from '../../components/NavbarComponent/NavbarComponet';
import CategoryProduct from '../../components/CategoryProduct/CategoryProduct';
// import NavbarComponent from '../../components/NavbarComponent/NavbarComponet';

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounceHooks(searchProduct, 500);

    const [loading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(4);
    const [sort, setSort] = useState('asc');
    const [typeProduct, setTypeProduct] = useState([]);
    const [categoryProduct, setCategoryProduct] = useState([]);

    const fetchProductAll = async (context) => {
        // console.log('context', context);

        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const sort = context?.queryKey && context?.queryKey[3];
        const res = await ProductService.getAllProduct(search, limit, sort);

        return res;
    };

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }

        // return res
    };

    const fetchAllCategoryProduct = async () => {
        const res = await CategoryService.getAllCategory();
        if (res?.status === 'OK') {
            setCategoryProduct(res?.data);
        }

        // console.log('resdat', res);
    };

    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery(['products', limit, searchDebounce, sort], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });
    // console.log('isPreviousData', isPreviousData, isLoading);

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    useEffect(() => {
        fetchAllCategoryProduct();
    }, []);

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ margin: '0 auto', width: '1270px' }}>
                <WrapperTypeProduct>
                    {typeProduct.map((item, index) => (
                        <TypeProduct name={item} key={index} />
                    ))}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ backgroundColor: '#efefef', width: '1270px', margin: '0 auto' }}>
                    <SliderComponet arrImage={[slider1, slider2, slider3]}></SliderComponet>
                    <WrapperTypeProduct style={{ backgroundColor: 'white', marginTop: '15px' }}>
                        {categoryProduct.map((categoryd, index) => (
                            <CategoryProduct name={categoryd.name} key={index} />
                        ))}
                    </WrapperTypeProduct>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% -20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavbarComponet></NavbarComponet>
                        </WrapperNavbar>
                        <Col
                            span={20}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <WrapperProducts>
                                {products?.data?.map((product) => {
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
                            <div
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}
                            >
                                <WrapperButtonMore
                                    textButton={isPreviousData ? 'Load more' : 'Xem thêm'}
                                    type="outline"
                                    style={{
                                        border: '1px solid rgb(11 ,116,229)',
                                        color: 'rgb(11 ,116,229)',
                                        with: '240px',
                                        height: '38px',
                                        borderRadius: '4px',
                                    }}
                                    disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                                    onClick={() => setLimit((prev) => prev + 4)}
                                ></WrapperButtonMore>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default HomePage;
