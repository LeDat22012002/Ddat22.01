import { Image } from 'antd';
import { StyleSlider } from './style';
const SliderComponet = ({ arrImage }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    return (
        <StyleSlider {...settings}>
            {arrImage.map((image, index) => {
                return <Image key={index} src={image} alt="slider" preview={false} width="100%"></Image>;
            })}
        </StyleSlider>
    );
};

export default SliderComponet;
