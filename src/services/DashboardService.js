import axios from "axios";

export const getDashboardSummary = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/summary`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error in getDashboardSummary:', error);
        throw error;
    }
};

export const getOrderStats = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/orders/stats`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error in getOrderStats:', error);
        throw error;
    }
};

export const getMonthlyRevenue = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/revenue/monthly`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error in getMonthlyRevenue:', error);
        throw error;
    }
};

export const getTopProducts = async (limit = 5) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/products/top`, {
            params: { limit },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error in getTopProducts:', error);
        throw error;
    }
};

export const getRecentOrders = async (days = 7) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/orders/recent`, {
            params: { days },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error in getRecentOrders:', error);
        throw error;
    }
};
