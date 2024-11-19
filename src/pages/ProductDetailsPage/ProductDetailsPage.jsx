import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '0 120px', backgroundColor: '#efefef', marginTop: '60px' }}>
            <div>
                <h5
                    style={{
                        marginTop: '1px',
                        paddingTop: '20px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                    }}
                >
                    <span
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Trang chủ
                    </span>
                    - Chi tiết sản phẩm
                </h5>
                <ProductDetailComponent idProduct={id}></ProductDetailComponent>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
