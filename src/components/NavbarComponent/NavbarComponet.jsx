import React, { useEffect, useState } from 'react';
import { Checkbox, Rate } from 'antd';
import {
    LableContent,
    LableText,
    // LableTextPrice,
    LableTextValue,
} from './style';
import {
    getAllBrand,
    getAllCategory,
    getProductByBrandId,
    getProductByCategoryId,
} from '../../services/ProductService';

const NavbarComponet = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                if (response?.status === 'OK') {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await getAllBrand();
                if (response?.status === 'OK') {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        fetchBrands();
    }, []);

    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId);
        try {
            if (categoryId) {
                const response = await getProductByCategoryId(categoryId);
                if (response?.status === 'OK') {
                    onFilterChange(response.data);
                }
            } else {
                // Khi chọn "Tất cả sản phẩm"
                onFilterChange(null);
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    const handleBrandChange = async (brandId) => {
        setSelectedBrand(brandId);

        try {
            if (brandId) {
                const response = await getProductByBrandId(brandId);
                if (response?.status === 'OK') {
                    onFilterChange(response.data);
                }
            } else {
                // Khi chọn "Tất cả sản phẩm"
                onFilterChange(null);
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    //
    const handleChangeAll = async (brandId, categoryId) => {
        setSelectedBrand(brandId);
        setSelectedCategory(categoryId);
        try {
            if (brandId) {
                const response = await getProductByBrandId(brandId);
                if (response?.status === 'OK') {
                    onFilterChange(response.data);
                }
            } else if (categoryId) {
                const response = await getProductByCategoryId(categoryId);
                if (response?.status === 'OK') {
                    onFilterChange(response.data);
                }
            } else {
                // Khi chọn "Tất cả sản phẩm"
                onFilterChange(null);
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    return (
        <div>
            <LableText>Danh mục</LableText>
            <LableContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <LableTextValue
                        style={{
                            backgroundColor: !selectedCategory ? '#1890ff' : '#fff',
                            color: !selectedCategory ? '#fff' : '#000',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                        onClick={() => handleChangeAll(null)}
                    >
                        Tất cả sản phẩm
                    </LableTextValue>
                    {categories.map((category) => (
                        <Checkbox
                            style={{ marginLeft: 0 }}
                            key={category._id}
                            checked={selectedCategory === category._id}
                            onChange={() => handleCategoryChange(category._id)}
                        >
                            {category.name}
                        </Checkbox>
                    ))}
                </div>
            </LableContent>
            <LableText>Thương hiệu</LableText>
            <LableContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* <LableTextValue
                        style={{
                            backgroundColor: !selectedBrand ? '#1890ff' : '#fff',
                            color: !selectedBrand ? '#fff' : '#000',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                        onClick={() => handleChangeAll(null)}
                    >
                        Tất cả sản phẩm
                    </LableTextValue> */}
                    {brands.map((brand) => (
                        <Checkbox
                            style={{ marginLeft: 0 }}
                            key={brand._id}
                            checked={selectedBrand === brand._id}
                            onChange={() => handleBrandChange(brand._id)}
                        >
                            {brand.name}
                        </Checkbox>
                    ))}
                </div>
            </LableContent>
        </div>
    );
};

export default NavbarComponet;
