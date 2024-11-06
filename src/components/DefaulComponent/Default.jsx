import HeaderComponent from "../HeaderComponent/Header";

function DefaultComponent({children}) {
    return ( 
    <div>
        <HeaderComponent />
        {children}
    </div> );
}

export default DefaultComponent;