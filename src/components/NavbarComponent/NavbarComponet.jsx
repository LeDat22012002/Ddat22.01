import React, { useEffect, useState } from 'react';
import { Checkbox, Rate } from 'antd';
import {
    LableContent,
    LableText,
    LableTextPrice,
    LableTextValue
} from './style';
import { getAllCategory, getProductByCategoryId } from '../../services/ProductService';

const NavbarComponet = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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
                            borderRadius: '4px'
                        }}
                        onClick={() => handleCategoryChange(null)}
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
        </div>
    );
};

export default NavbarComponet;