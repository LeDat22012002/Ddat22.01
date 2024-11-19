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
import { Col, Row, Select, Space } from 'antd';
import NavbarComponet from '../../components/NavbarComponent/NavbarComponet';
// import CategoryProduct from '../../components/CategoryProduct/CategoryProduct';

const { Option } = Select;

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounceHooks(searchProduct, 500);

    const [loading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(8);
    const [sort, setSort] = useState('newest');
    const [sortTpye, setSortTpye] = useState('Dáng Đàn');
    const [typeProduct, setTypeProduct] = useState([]);
    // const [categoryProduct, setCategoryProduct] = useState([]);
    // const [brandProduct, setBrandProduct] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null);

    const sortOptions = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'asc', label: 'Giá thấp đến cao' },
        { value: 'desc', label: 'Giá cao đến thấp' },
        { value: 'selle', label: 'Sản phẩm bán chạy nhất' },
    ];

    // const OptionsType = [
    //     { value: 'dangdan', label: 'Dáng Đàn' },
    //     { value: 'dángtròn', label: 'Dáng tròn' },
    //     { value: 'dángkhuyết', label: 'Dáng khuyết' },
    // ];

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const sort = context?.queryKey && context?.queryKey[3];
        const categoryId = context?.queryKey && context?.queryKey[4];
        const brandId = context?.queryKey && context?.queryKey[5];

        if (categoryId) {
            const res = await ProductService.getProductByCategoryId(categoryId);
            return res;
        } else if (brandId) {
            const res = await ProductService.getProductByBrandId(brandId);
            return res;
        } else {
            const res = await ProductService.getAllProduct(search, limit, sort);
            return res;
        }
    };

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    // const fetchAllCategoryProduct = async () => {
    //     const res = await CategoryService.getAllCategory();
    //     if (res?.status === 'OK') {
    //         setCategoryProduct(res?.data);
    //     }
    // };

    const {
        isLoading,
        data: products,
        isPreviousData,
        refetch: refetchProducts,
    } = useQuery(['products', limit, searchDebounce, sort, selectedCategory, selectedBrand], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    // useEffect(() => {
    //     fetchAllCategoryProduct();
    // }, []);

    // const handleCategoryClick = (categoryId) => {
    //     setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    //     setLimit(4);
    // };

    const handleSortChange = (value) => {
        setSort(value);
        setSelectedCategory(null);
        setSelectedBrand(null);
        refetchProducts();
    };

    const handleChangeType = (value) => {
        setTypeProduct(value);
        setSelectedCategory(null);
        setSelectedBrand(null);
        refetchProducts();
    };

    const handleFilterChange = (products) => {
        setFilteredProducts(products);
        setLimit(8);
    };

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ margin: '0 auto', width: '1270px', marginTop: '60px' }}>
                <WrapperTypeProduct>
                    {/* {typeProduct.map((item, index) => (
                        <TypeProduct name={item} key={index} />
                    ))} */}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ backgroundColor: '#efefef', width: '1270px', margin: '0 auto' }}>
                    <SliderComponet arrImage={[slider1, slider2, slider3]} />

                    {/* Categories */}
                    {/* <WrapperTypeProduct style={{ backgroundColor: 'white', marginTop: '15px' }}>
                        <div
                            onClick={() => handleCategoryClick(null)}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                backgroundColor: !selectedCategory ? '#1890ff' : 'transparent',
                                color: !selectedCategory ? 'white' : 'black',
                                borderRadius: '4px',
                            }}
                        >
                            Tất cả sản phẩm
                        </div>
                        {categoryProduct.map((category) => (
                            <div
                                key={category._id}
                                onClick={() => handleCategoryClick(category._id)}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedCategory === category._id ? '#1890ff' : 'transparent',
                                    color: selectedCategory === category._id ? 'white' : 'black',
                                    borderRadius: '4px',
                                }}
                            >
                                {category.name}
                            </div>
                        ))}
                    </WrapperTypeProduct> */}

                    {/* Sort Section */}
                    <div
                        style={{
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            marginTop: '20px',
                        }}
                    >
                        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: '16px', fontWeight: 500 }}>
                                {products?.total || products?.data?.length || 0} Sản phẩm
                            </span>
                            <Select
                                defaultValue="newest"
                                style={{ width: 200 }}
                                onChange={handleSortChange}
                                value={sort}
                                disabled={!!selectedCategory}
                            >
                                {sortOptions.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                            {/* <Select
                                // defaultValue="Dáng đàn"
                                style={{ width: 200 }}
                                onChange={handleChangeType}
                                value={typeProduct}
                                disabled={!!selectedCategory}
                                // placeholder="Dáng đàng"
                            >
                                {typeProduct.map((item, index) => (
                                    <Option key={index} value={item}>
                                        <TypeProduct name={item} key={index} />
                                    </Option>
                                ))}
                            </Select> */}
                        </Space>
                    </div>

                    {/* Products Grid */}
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% -20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavbarComponet onFilterChange={handleFilterChange} />
                        </WrapperNavbar>
                        <Col span={20}>
                            <WrapperProducts>
                                {(filteredProducts || products?.data)?.map((product) => (
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
                                        brand={product.brand}
                                    />
                                ))}
                            </WrapperProducts>
                            <div
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}
                            >
                                <WrapperButtonMore
                                    textButton={isPreviousData ? 'Load more' : 'Xem thêm'}
                                    type="outline"
                                    style={{
                                        border: '1px solid rgb(11, 116, 229)',
                                        color: 'rgb(11, 116, 229)',
                                        width: '240px',
                                        height: '38px',
                                        borderRadius: '4px',
                                    }}
                                    disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                                    onClick={() => setLimit((prev) => prev + 8)}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default HomePage;
