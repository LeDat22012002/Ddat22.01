import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import {
    LableContent,
    LableText,
    LableTextValue,
} from './style';
import {
    getAllBrand,
    getAllCategory,
    searchProducts
} from '../../services/ProductService';

const NavbarComponet = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    // Fetch categories
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

    // Fetch brands
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

    // Search products whenever filters change
    useEffect(() => {
        handleSearch();
    }, [selectedCategories, selectedBrands]);

    const handleSearch = async () => {
        try {
            // Nếu không có filter nào được chọn
            if (selectedCategories.length === 0 && selectedBrands.length === 0) {
                onFilterChange(null);
                return;
            }

            // Tạo params cho search
            const searchParams = {
                categories: selectedCategories,
                brands: selectedBrands,
                page: 0,
                limit: 100
            };

            const response = await searchProducts(searchParams);
            if (response?.status === 'OK') {
                onFilterChange(response.data);
            }
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleCategoryChange = (categoryId, checked) => {
        setSelectedCategories(prev => {
            if (checked) {
                return [...prev, categoryId];
            } else {
                return prev.filter(id => id !== categoryId);
            }
        });
    };

    const handleBrandChange = (brandId, checked) => {
        setSelectedBrands(prev => {
            if (checked) {
                return [...prev, brandId];
            } else {
                return prev.filter(id => id !== brandId);
            }
        });
    };

    const handleShowAll = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        onFilterChange(null);
    };

    return (
        <div>
            <LableText>Danh mục</LableText>
            <LableContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <LableTextValue
                        style={{
                            backgroundColor: selectedCategories.length === 0 && selectedBrands.length === 0 ? '#1890ff' : '#fff',
                            color: selectedCategories.length === 0 && selectedBrands.length === 0 ? '#fff' : '#000',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                        onClick={handleShowAll}
                    >
                        Tất cả sản phẩm
                    </LableTextValue>
                    {categories.map((category) => (
                        <Checkbox
                            style={{ marginLeft: 0 }}
                            key={category._id}
                            checked={selectedCategories.includes(category._id)}
                            onChange={(e) => handleCategoryChange(category._id, e.target.checked)}
                        >
                            {category.name} ({category.productCount})
                        </Checkbox>
                    ))}
                </div>
            </LableContent>
            
            <LableText>Thương hiệu</LableText>
            <LableContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {brands.map((brand) => (
                        <Checkbox
                            style={{ marginLeft: 0 }}
                            key={brand._id}
                            checked={selectedBrands.includes(brand._id)}
                            onChange={(e) => handleBrandChange(brand._id, e.target.checked)}
                        >
                            {brand.name} ({brand.productCount})
                        </Checkbox>
                    ))}
                </div>
            </LableContent>
        </div>
    );
};

export default NavbarComponet;
