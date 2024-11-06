import { useNavigate } from 'react-router-dom';

const CategoryProduct = ({ name }) => {
    const navigate = useNavigate();
    const handleNavigateCategory = (category) => {
        navigate(
            `/products/${category
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                ?.replace(/ /g, '_')}`,
            { state: category },
        );
    };
    return (
        <div
            style={{ padding: '0 10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
            onClick={() => handleNavigateCategory(name)}
        >
            {name}
        </div>
    );
};

export default CategoryProduct;
