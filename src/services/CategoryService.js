import axios from 'axios';
import { axiosJWT } from './UserService';

export const getAllCategory = async (access_token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-allCategory`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const createCategory = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create`, data);
    return res.data;
};

export const updateCategory = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/category/update-category/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });

    return res.data;
};

export const deleteCategory = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/category/delete-category/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });

    return res.data;
};

export const getDetailsCategory = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-detailsCategory/${id}`);

    return res.data;
};
