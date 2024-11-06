import axios from 'axios';
import { axiosJWT } from './UserService';

export const getAllBrand = async (access_token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/get-allBrand`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const createBrand = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/brand/create`, data);
    return res.data;
};

export const updateBrand = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/brand/update-brand/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });

    return res.data;
};

export const deleteBrand = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/brand/delete-brand/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });

    return res.data;
};

export const getDetailsBrand = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/get-detailsBrand/${id}`);

    return res.data;
};
