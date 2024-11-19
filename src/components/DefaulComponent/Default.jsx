import FooterComponent from '../FooterComponent/Footer';
import HeaderComponent from '../HeaderComponent/Header';

function DefaultComponent({ children }) {
    return (
        <div>
            <HeaderComponent />
            {children}
            <FooterComponent />
        </div>
    );
}

export default DefaultComponent;
