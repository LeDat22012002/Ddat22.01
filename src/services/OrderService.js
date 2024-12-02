import { axiosJWT } from './UserService';

// Lấy tất cả đơn hàng
export const getAllOrder = async (access_token) => {
    try {
        const res = await axiosJWT.get(
            `${process.env.REACT_APP_API_URL}/order/get-all-order`,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw error;
    }
};

// Lấy chi tiết đơn hàng theo ID
export const getDetailsOrder = async (id, access_token) => {
    try {
        const res = await axiosJWT.get(
            `${process.env.REACT_APP_API_URL}/order/get-detailsOrder/${id}`,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error getting order details:', error);
        throw error;
    }
};

// Lấy đơn hàng theo user ID
export const getOrderByUserId = async (id, access_token) => {
    try {
        const res = await axiosJWT.get(
            `${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw error;
    }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id, data, access_token) => {
    try {
        const res = await axiosJWT.put(
            `${process.env.REACT_APP_API_URL}/order/update-status/${id}`,
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// Tạo đơn hàng mới
export const createOrder = async (data, access_token) => {
    try {
        const res = await axiosJWT.post(
            `${process.env.REACT_APP_API_URL}/order/create`,
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId, userId, access_token) => {
    try {
        console.log('Cancel order request:', {
            orderId,
            userId,
            access_token: access_token?.slice(0, 20) + '...'
        });

        if (!access_token || !userId) {
            throw new Error('Thiếu thông tin xác thực');
        }
        
        const res = await axiosJWT.put(
            `${process.env.REACT_APP_API_URL}/order/cancel-order/${orderId}`,
            { userId: userId }, // Đảm bảo gửi userId trong body
            {
                headers: {
                    token: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Cancel order response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error cancelling order:', error.response?.data || error);
        throw error;
    }
};
