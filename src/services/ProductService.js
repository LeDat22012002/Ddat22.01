import axios from 'axios';
import { axiosJWT } from './UserService';

// Get all products with filter
export const getAllProduct = async (search, limit, sort) => {
    try {
        let url = `${process.env.REACT_APP_API_URL}/product/getAll-product`;
        let params = {};

        if (search?.length > 0) {
            params = {
                filter: ['name', search],
                limit,
            };
        } else {
            params = {
                limit,
                sort,
            };
        }

        const res = await axios.get(url, { params });
        return res.data;
    } catch (error) {
        console.error('Error getting all products:', error);
        throw error;
    }
};

// Get products by type
export const getProductType = async (type, page, limit) => {
    try {
        if (!type) return null;

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll-product`, {
            params: {
                filter: ['type', type],
                page,
                limit,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error getting products by type:', error);
        throw error;
    }
};
// Lấy tất cả sản phẩm theo danh mục
export const getProductCategory = async (categoryId, page = 0, limit = 20, sort = 'newest') => {
    try {
        if (!categoryId) return null;

        // Sử dụng filter với category
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll-product`, {
            params: {
                filter: 'category',
                filter: categoryId,
                page,
                limit,
                sort,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error getting products by category:', error);
        throw error;
    }
};
// Lấy tất cả sản phẩm theo thương hiệu
export const getProductBrand = async (brandId, page = 0, limit = 20, sort = 'newest') => {
    try {
        if (!brandId) return null;

        // Sử dụng filter với brand
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll-product`, {
            params: {
                filter: 'brand',
                filter: brandId,
                page,
                limit,
                sort,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error getting products by brand:', error);
        throw error;
    }
};

// CRUD product
export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
    return res.data;
};

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details-product/${id}`);
    return res.data;
};

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

// Delete many products
export const deleteManyProduct = async (ids, access_token) => {
    try {
        const res = await axiosJWT.post(
            `${process.env.REACT_APP_API_URL}/product/delete-many`,
            { ids },
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error('Error deleting multiple products:', error);
        throw error;
    }
};

// Get types product
export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`);
    return res.data;
};
// Get categorys product
export const getAllCategoryProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-categoryProduct`);
    return res.data;
};
// Get brands product
export const getAllBrandProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-brandProduct`);
    return res.data;
};
// get sản phẩm theo id của danh mục
export const getProductByCategoryId = async (categoryId) => {
    try {
        if (!categoryId) return null;

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/category/${categoryId}`);
        return res.data;
    } catch (error) {
        console.error('Error getting products by specific category ID:', error);
        throw error;
    }
};
// get sản phẩm theo id của brand
export const getProductByBrandId = async (brandId) => {
    try {
        if (!brandId) return null;

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/brand/${brandId}`);
        return res.data;
    } catch (error) {
        console.error('Error getting products by specific brand ID:', error);
        throw error;
    }
};

export const getAllCategory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-allCategory`, {});
    return res.data;
};

export const getAllBrand = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/get-allBrand`);
    return res.data;
};

// export default {
//     getAllCategory,
//     getAllProduct,
//     getProductType,
//     getProductCategory,
//     createProduct,
//     getDetailsProduct,
//     updateProduct,
//     deleteProduct,
//     deleteManyProduct,
//     getAllTypeProduct,
//     getAllCategoryProduct,
//     getProductByCategoryId,
//     getProductBrand,
// };
