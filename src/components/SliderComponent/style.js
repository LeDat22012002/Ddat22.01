import Slider from 'react-slick';
import styled from 'styled-components';

export const StyleSlider = styled(Slider)`
    & .slick-arrow.slick-prev {
        left: 12px;
        top: 50%;
        z-index: 9;
        &::before {
            font-size: 40px;
            color: #ffff;
        }
    }
    & .slick-arrow.slick-next {
        right: 28px;
        top: 50%;
        z-index: 9;
        &::before {
            font-size: 40px;
            color: #ffff;
        }
    }
    & .slick-dots {
        z-index: 9;
        bottom: -2px !important;
        li {
            button {
                &::before {
                    color: rgb(255, 255, 0.5);
                }
            }
        }
        li .active {
            button {
                &::before {
                    color: #fff;
                }
            }
        }
    }
`;
